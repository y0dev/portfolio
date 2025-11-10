import os
import re
import json
import time
import pypugjs # type: ignore
from ftplib import FTP, error_perm
from datetime import datetime
from .category_mapper import select_category_from_tags



def format_time(epoch_time):
    return datetime.fromtimestamp(epoch_time).strftime("%Y-%m-%d %H:%M:%S")

def convert_pug_to_html(pug_file_path: str, output_html_path: str = None) -> str:
    """
    Converts a Pug file to an HTML file with error handling.

    :param pug_file_path: Path to the input .pug file
    :param output_html_path: Optional path for the output .html file.
    :return: Path to the generated HTML file
    """
    if not os.path.isfile(pug_file_path):
        print(f"[File Error] Pug file '{pug_file_path}' does not exist.")
        return ""

    try:
        with open(pug_file_path, 'r', encoding='utf-8') as f:
            pug_content = f.read()
    except Exception as e:
        print(f"[Read Error] Failed to read file '{pug_file_path}': {e}")
        return ""

    try:
        html_content = pypugjs.simple_convert(pug_content)
    except Exception as e:
        print(f"[Conversion Error] Failed to convert Pug to HTML: {e}")
        return ""

    if output_html_path is None:
        base, _ = os.path.splitext(pug_file_path)
        output_html_path = base + ".html"

    try:
        with open(output_html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"Converted {pug_file_path} to {output_html_path}")
        return output_html_path
    except Exception as e:
        print(f"[Write Error] Failed to write HTML file '{output_html_path}': {e}")
        return ""
# Example usage:
# convert_pug_to_html("output/sample.pug")


def upload_folder_to_ftp(ftp_host: str, ftp_user: str, ftp_pass: str,
                         local_folder: str, remote_folder: str = "/", ftp_port: int = 21):
    """
    Uploads a local folder (and its contents) to a remote FTP server.

    :param ftp_host: FTP server address
    :param ftp_port: FTP server port (usually 21)
    :param ftp_user: FTP username
    :param ftp_pass: FTP password
    :param local_folder: Path to the local folder to upload
    :param remote_folder: Path to the destination folder on the FTP server
    """
    def upload_file(ftp_conn, file_path, remote_path):
        with open(file_path, "rb") as f:
            ftp_conn.storbinary(f'STOR {remote_path}', f)

    def upload_directory(ftp_conn, local_dir, remote_dir):
        # Create the remote directory if it doesn't exist
        try:
            ftp_conn.mkd(remote_dir)
            print(f"Created remote directory: {remote_dir}")
        except Exception:
            pass  # Ignore if the directory already exists

        # Change into remote directory
        ftp_conn.cwd(remote_dir)

        for item in os.listdir(local_dir):
            local_path = os.path.join(local_dir, item)
            if os.path.isfile(local_path):
                print(f"Uploading file: {item}")
                upload_file(ftp_conn, local_path, item)
            elif os.path.isdir(local_path):
                print(f"Entering directory: {item}")
                # Recursively upload subdirectories
                upload_directory(ftp_conn, local_path, item)

        # Go back to the parent directory after uploading a folder
        ftp_conn.cwd("..")

    # Connect to FTP server on custom port
    with FTP() as ftp:
        ftp.connect(ftp_host, ftp_port)
        ftp.login(ftp_user, ftp_pass)

        # Create the top-level remote directory
        upload_directory(ftp, local_folder, remote_folder)

        print("Upload completed.")


# Example usage:
# upload_folder_to_ftp('ftp.example.com', 'your_user', 'your_pass', 'local_folder_path', 'remote_folder_path')

def upload_file_to_ftp(ftp_host: str, ftp_user: str, ftp_pass: str,
                       local_file_path: str, remote_folder: str = "/", port: int = 21):
    """
    Uploads a single file to a remote FTP server with error handling.

    :param ftp_host: FTP server address
    :param ftp_user: FTP username
    :param ftp_pass: FTP password
    :param local_file_path: Path to the local file to upload
    :param remote_folder: Remote folder where the file will be uploaded
    :param port: FTP port (default is 21)
    """
    if not os.path.isfile(local_file_path):
        print(f"[Local Error] File not found: {local_file_path}")
        return

    filename = os.path.basename(local_file_path)

    ftp = FTP()
    try:
        ftp.connect(ftp_host, port)
        print(f"Connected to {ftp_host}:{port}")
    except Exception as e:
        print(f"[Connection Error] Could not connect to {ftp_host}:{port} - {e}")
        return

    try:
        ftp.login(ftp_user, ftp_pass)
        print("Logged in successfully.")
    except Exception as e:
        print(f"[Login Error] Failed to login as '{ftp_user}' - {e}")
        ftp.quit()
        return

    try:
        ftp.cwd(remote_folder)
        print(f"Changed to remote directory: {remote_folder}")
    except error_perm as e:
        print(f"[Remote Directory Error] Failed to change to directory '{remote_folder}' - {e}")
        ftp.quit()
        return

    try:
        with open(local_file_path, "rb") as file:
            ftp.storbinary(f"STOR {filename}", file)
        print(f"Successfully uploaded: {filename} → {remote_folder}")
    except Exception as e:
        print(f"[Upload Error] Failed to upload file '{filename}' - {e}")
    finally:
        try:
            ftp.quit()
            print("FTP connection closed.")
        except Exception:
            pass

def download_file_from_ftp(ftp_host: str, ftp_user: str, ftp_pass: str, remote_path: str, local_path: str, ftp_port: int = 21):
    """
    Downloads a file from an FTP server with error handling.

    :param ftp_host: FTP server address
    :param ftp_user: FTP username
    :param ftp_pass: FTP password
    :param remote_path: Path to the file on the FTP server
    :param local_path: Local path to save the downloaded file
    :param ftp_port: FTP port (default is 21)
    """
    ftp = FTP()
    try:
        ftp.connect(ftp_host, ftp_port)
        print(f"Connected to {ftp_host}:{ftp_port}")
    except Exception as e:
        print(f"[Connection Error] Failed to connect to {ftp_host}:{ftp_port} - {e}")
        return

    try:
        ftp.login(ftp_user, ftp_pass)
        print("Logged in successfully.")
    except Exception as e:
        print(f"[Login Error] Failed to log in as '{ftp_user}' - {e}")
        return

    try:
        with open(local_path, 'wb') as f:
            ftp.retrbinary(f'RETR {remote_path}', f.write)
        print(f"Successfully downloaded: {remote_path} → {local_path}")
    except error_perm as e:
        print(f"[Permission Error] Cannot retrieve file '{remote_path}' - {e}")
    except FileNotFoundError:
        print(f"[Local Error] Cannot write to local path '{local_path}'")
    except Exception as e:
        print(f"[Download Error] Error downloading '{remote_path}' - {e}")
    finally:
        try:
            ftp.quit()
            print("FTP connection closed.")
        except Exception:
            pass

def create_new_markdown(output_dir="input_md"):
    """
    Generates a new Markdown (.md) file with user-specified metadata.

    :param output_dir: Directory where the new Markdown file will be saved
    :type output_dir: str
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    title = input("Enter title: ").strip()
    if not title:
        print("Title is required.")
        return

    description = input("Enter description (optional): ").strip()
    date = datetime.now()
    date_str = date.strftime("%B %d, %Y")
    today_for_summary = date.strftime("%m/%d/%Y")

    category = select_category_from_tags().strip().capitalize()

    # Ask for type
    while True:
        doc_type = input("Is this a 'Note' or an 'Article'? ").strip().capitalize()
        if doc_type in ["Note", "Article"]:
            break
        else:
            print("Please enter 'Note' or 'Article'.")

    filename_slug = title.lower().replace(" ", "-").replace("/", "-").replace("&", "and")
    filename = f"{filename_slug}.md"
    filepath = os.path.join(output_dir, filename)

    content = f"""# {title}

## Blog/Note Info

- Title: {title}
- Description: {description}
- Date: {date_str}
- Category: {category}
- Type: {doc_type}

## Summary (Quick Recall)

**Date {today_for_summary}**
**Reviewed On MM/DD/YYYY**

### Topic: <Name>
"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Markdown file created: {filepath}")


def select_markdown_file(folder_path="input_md") -> str:
    """
    Prompts user to select a Markdown (.md) file from a given folder,
    sorted by most recent modification time (newest first).

    :param folder_path: Folder containing Markdown files
    :type folder_path: str
    :return: The full path to the selected Markdown file
    :rtype: str
    """
    # List .md files with their full paths
    md_files = [
        (f, os.path.getmtime(os.path.join(folder_path, f)))
        for f in os.listdir(folder_path)
        if f.endswith('.md')
    ]

    if not md_files:
        raise FileNotFoundError(f"No Markdown (.md) files found in '{folder_path}'")

    # Sort files by modification time (newest first)
    md_files.sort(key=lambda x: x[1], reverse=True)

    # Show the list to the user
    print("Select a Markdown file:")
    for idx, (filename, mtime) in enumerate(md_files):
        modified_time = os.path.getmtime(os.path.join(folder_path, filename))
        readable_time = os.path.getctime(os.path.join(folder_path, filename))
        print(f"{idx + 1}: {filename} (Modified: {format_time(modified_time)})")

    # Prompt for selection
    while True:
        try:
            choice = int(input(f"Enter a number (1-{len(md_files)}): "))
            if 1 <= choice <= len(md_files):
                selected_file = md_files[choice - 1][0]
                break
            else:
                print("Invalid number, try again.")
        except ValueError:
            print("Invalid input, please enter a number.")

    # Return full path
    return os.path.join(folder_path, selected_file)


def update_js_json_data(js_file_path: str, new_entry: dict, entry_type: str = "article"):
    """
    Update the JavaScript file's embedded JSON list for either articles (R) or notes (M).

    :param js_file_path: Path to the .js file
    :param new_entry: Dictionary with the new entry data
    :param entry_type: "article" or "note"
    """
    
    print(f"Entry Type: {entry_type}")
    print(f"New Entry: {new_entry}")

    assert entry_type in ("article", "note"), "entry_type must be either 'article' or 'note'"
    
    with open(js_file_path, "r", encoding="utf-8") as f:
        js_code = f.read()

    variable_name = "R" if entry_type == "article" else "M"

    # Match JSON.parse([...]) assigned to R or M
    pattern = re.compile(
        rf"{variable_name}\s*=\s*JSON\.parse\(\s*'(?P<json_data>\[.*?\])'\s*\)",
        re.DOTALL
    )
    match = pattern.search(js_code)

    if not match:
        raise ValueError(f"Could not find JSON block for {variable_name} in the file.")

    current_json_str = match.group("json_data")
    json_list = json.loads(current_json_str)

    # Add timestamp if not present
    if "date" not in new_entry:
        new_entry["date"] = int(time.time() * 1000)

    # Add file-id
    new_entry["file-id"] = entry_type

    # Append new entry
    json_list.append(new_entry)

    # Convert back to compact JSON
    updated_json_str = json.dumps(json_list, ensure_ascii=False)

    # Replace in JS
    new_js_code = pattern.sub(
        f"{variable_name} = JSON.parse('{updated_json_str}')",
        js_code
    )

    with open(js_file_path, "w", encoding="utf-8") as f:
        f.write(new_js_code)

    print(f"✅ Successfully updated {entry_type} list in {js_file_path}")