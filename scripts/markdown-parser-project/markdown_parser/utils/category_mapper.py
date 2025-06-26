def get_category_tags() -> dict:
    category_tags = {
        "theology": ["Theology", "God", "Gospel", "Reformed"],
        "covenant": ["Christ", "Covenant", "Reformed", "Gospel"],
        "thankful": ["Christ", "Salvation", "Love", "Thankful"],
        "health": ["Health", "Fitness"],
        "tech": ["Technology", "Engineer"],
        "technology": ["Technology", "Engineer"],
        "embedded": ["Technology", "Embedded", "Engineer"],
        "quantum": ["Technology", "Quantum"],
        "algo": ["Data Structures", "Algorithms", "Tech Interview"],
        "algorithm": ["Data Structures", "Algorithms", "Tech Interview"],
        "system design": ["System Design", "Technology", "Tech Interview"],
        "security": ["Cybersecurity", "Encryption", "Network Security"],
        "cloud": ["Cloud Computing", "AWS", "Azure", "GCP"],
        "ai": ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
        "risc-v": ["RISC-V", "Embedded Systems", "Microcontrollers"],
        "linux": ["Linux", "Operating Systems", "Kernel Development"],
        "docker": ["Docker", "Containers", "DevOps"],
        "kubernetes": ["Kubernetes", "Container Orchestration", "DevOps"],
        "networking": ["Networking", "TCP/IP", "Protocols"],
        "database": ["Database", "SQL", "NoSQL"],
        "system programming": ["Low-Level Programming", "Assembly", "Embedded"],
        "web development": ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS"],
        "cryptography": ["Cryptography", "Randomness Testing", "Security", "Encryption"],
        "default": ["Template", "Info", "Beginner"],
    }
    return category_tags

def select_category_from_tags() -> str:
    """
    Display categories derived from tag mapping and prompt user to select one.

    :return: The selected category key (e.g., 'embedded', 'theology')
    :rtype: str
    """
    category_tags = get_category_tags()

    # Remove duplicates and skip "default"
    unique_keys = sorted({k for k in category_tags if k != "default"})
    
    print("\nSelect a category:")
    for i, key in enumerate(unique_keys, start=1):
        print(f"{i}: {key.title()} - Tags: {', '.join(category_tags[key])}")

    while True:
        try:
            choice = int(input(f"Enter a number (1-{len(unique_keys)}): "))
            if 1 <= choice <= len(unique_keys):
                return unique_keys[choice - 1]
            else:
                print("Invalid number, try again.")
        except ValueError:
            print("Invalid input, please enter a number.")


def get_tags_for_category(category: str) -> list:
    category = category.lower()

    category_tags = get_category_tags()

    return category_tags.get(category, category_tags["default"])


def get_image_info_for_category(category: str) -> dict:
    """
    Returns a dict with 'alt' and 'name' keys for the image.

    :param category: Category name (case-insensitive)
    :type category: str
    :return: Dictionary with 'alt' and 'name' for the image
    :rtype: dict
    """
    category = category.lower()

    image_mappings = {
        ("theology", "covenant"): {"alt": "bible-icon", "name": "images/bible-icon.png"},
        ("thankful",): {"alt": "thankful-icon", "name": "images/thankful.png"},
        ("family",): {"alt": "family-image", "name": "images/family.png"},
        ("health",): {"alt": "health-img", "name": "images/heart_strength.png"},
        ("tech", "technology", "code", "system design"): {"alt": "web-dev-img", "name": "images/web-dev.png"},
        ("algo", "algorithm"): {"alt": "algo-img", "name": "images/algorithm.png"},
        ("embedded",): {"alt": "binary-code-img", "name": "images/binary-code.png"},
        ("quantum",): {"alt": "physics-img", "name": "images/physics-icon.png"},
        ("docker",): {"alt": "docker-image", "name": "images/docker.png"},
        ("jenkins",): {"alt": "jenkins-image", "name": "images/jenkins.png"},
        ("cryptography",): {"alt": "crypto-img", "name": "images/crypto.png"},
    }

    for categories, image_info in image_mappings.items():
        if category in categories:
            return image_info

    # Default
    return {"alt": "image-title", "name": "images/image.png"}


# Example usage
if __name__ == "__main__":
    cat = "tech"
    print(f"Tags for '{cat}': {get_tags_for_category(cat)}")
    print(f"Image for '{cat}': {get_image_info_for_category(cat)}")
