export interface Image {
  id: string;
  alt?: string;
  link?: string;   // external or fallback
  image?: string;  // internal / static asset
  title?: string;
  caption?: string;
}

export interface CodeBlock {
  title?: string;
  id: string;
  language: string;
  content: string[];
}

export interface Blockquote {
  id: string;
  content: string;
}

export interface LinkItem {
  id: string;
  text: string;
  website?: string;  // original format
  link?: string;     // alternate key used in notes
  video?: boolean;   // optional flag if it’s a video
}

export interface List {
  id: string;
  items: string[];
  list_type: "ordered" | "unordered";
}

export interface SectionTitle {
  tag?: string; // e.g., h2
  text: string;
}

export interface ContentSection {
  title?: SectionTitle;            // optional title object
  paragraphs: string[];            // can contain placeholders
  images?: Image[];                // optional image list
  code?: CodeBlock[];              // optional code blocks
  blockquotes?: Blockquote[];      // optional quotes
  links?: LinkItem[];              // optional external links
  lists?: List[];                  // optional bullet/numbered lists
}

export interface TimeMeta {
  hours: string;
  mins: string;
  secs: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string;            // optional short summary
  date: string | number;           // support both "Jan 15, 2024" and timestamp
  tags: string[];
  image?: {
    name: string;
    alt: string;
  };
  time?: TimeMeta;                 // for notes/audio/podcast entries
  content: ContentSection[];
  type: "article" | "note";
}


export const metadata = {
  title: 'Articles & Notes | Devontae Reid',
  description: 'Thoughts, tutorials, and insights on web development and technology',
};



export const articles: Article[] = [
  {
    "id": "web-dev-choice",
    "title": "Web Development Choice",
    "description": "my time looking for a framework to create my portfolio website along with blog site",
    "date": "1636423946203",
    "tags": [
      "Technology",
      "ReactJS",
      "NodeJS"
    ],
    "image": {
      "name": "images/web-dev.png",
      "alt": "js-image"
    },
    "time": {
      "secs": "29",
      "mins": "00",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Beginning of NodeJS"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "As I embraced the task of creating a website, I ran into some problems. Those problems were choosing the right framework. There are many out there from React, VueJS, and even embedded JavaScript.",
          "So the one that rose to the top of my list was React. I find React to be very powerful for something that seems so simple to use. There are many things that React offered that the others did not such as CSS animation. Working in VueJS I found it fairly difficult to work with CSS animation. I would've just JavaScript to handle my animations, but I don't need all that power when it something simple as moving a div.",
          "My overall appreciation of React is :special-text(key='bold',great)special-text-end!"
        ],
        "images": [
          {
            "id": "001",
            "alt": "dev-work",
            "caption": "Programming Away",
            "link": "https://images.pexels.com/photos/196659/pexels-photo-196659.jpeg"
          }
        ],
        "code": [
          {
            "id": "001",
            "language": "javascript",
            "content": ["laboris"]
          }
        ],
        "blockquotes": [
          {
            "id": "001",
            "content": "laboris"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [],
            "list_type": "unordered"
          }
        ]
      }
    ]
  },
  {
    "id": "parenting-with-few-rules",
    "title": "Parenting with Few Rules | Doug Wilson",
    "description": "parenting as a Christian with few rules from Doug Wilson podcast",
    "date": "1628742217550",
    "tags": [
      "Parenting",
      "Christ",
      "Children"
    ],
    "image": {
      "name": "images/family.png",
      "alt": "parenting-img"
    },
    "time": {
      "secs": "47",
      "mins": "00",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Is it That Simple?"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "As being a new father I felt like this video was very helpful for setting ground rules for my kids as they grow up. You may think that if you have too many rules or your too lenient, but there is a way that one is ought to parent. If we want to be parents that live obedient to Christ as we raise our children while at the same time not being a helicopter parent.",
          "A video came up on my timeline from Pastor Doug Wilson of Christ Church in Moscow, Idaho. He speaks on being a parent who doesn't have so many rules and the reason why. He speaks on why as parents we shouldn't over complicate things for our children while at the same time teaching our children to think on their own when it comes to subject matters on what is right vs wrong. These rules not only established ground with you and your child, but also allows your child to critical think.",
          "Three Rules to Live by as a Parent: :listPlace(001)",
          "You can find the video on Youtube at the following :linkPlace(001)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "doug-wilson-parenting",
            "caption": "Fewer Rules in Parenting? | Doug Wilson",
            "link": "https://i.ytimg.com/vi/6S4LCPI9wk4/maxresdefault.jpg"
          }
        ],
        "blockquotes": [
          {
            "id": "001",
            "content": "laboris"
          }
        ],
        "links": [
          {
            "id": "001",
            "video": true,
            "text": "Fewer Rules in Parenting? | Doug Wilson",
            "link": "https://youtu.be/6S4LCPI9wk4"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "No lying",
              "No disobedience",
              "No disrespecting your mother"
            ],
            "list_type": "unordered"
          }
        ]
      }
    ]
  },
  {
    "id": "navy-seals-breathing",
    "title": "Navy Seals & Breathing",
    "description": "Learn how to breathe correctly while doing intense exercises to maximize performance and prevent injury. Tips to help you get the most out of your workouts.",
    "date": "1665111900994",
    "tags": [
      "Health",
      "Fitness"
    ],
    "image": {
      "name": "images/heart_strength.png",
      "alt": "health-img"
    },
    "time": {
      "secs": "37",
      "mins": "01",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Intro"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "Ever wonder why Navy SEALs are some of the world's most elite warriors? It's as simple as \"breathing\" literally. According to the Lung Association of Canada, we take on average 22,000 breaths a day. Wow, we take 22,000 breaths a day and don't give thanks for even a quarter of it.",
          "Thanks God for His mercy to allow us to take these breaths! Psalm 136",
          " :imagePlace(002)",
          "We can do a lot to help ourselves by practicing better breathing patterns. There are many different breathing patterns that can result in more energy and a clearer head. The well known breathing pattern is known as \"Box Breathing\". In this pattern you would exhale and inhale for the same duration around a box so to speak. :listPlace(001)",
          "Box breathing helps you deal effectively with stress and anxiety. It also brings balance to your body and mind along with regulating your natural heart rhythm."
        ],
        "images": [
          {
            "id": "001",
            "alt": "navy-seals",
            "caption": "Navy Seals Training",
            "link": "https://i0.wp.com/cms.sofrep.com/wp-content/uploads/2018/01/navy-seal-photo-065.jpg"
          },
          {
            "id": "002",
            "alt": "box-breathing-gif",
            "caption": "Box Breathing",
            "link": "https://images.squarespace-cdn.com/content/v1/5b8645f7266c07b084eb29c7/1570208020992-TRZCAX5P0A53CG0LS5AO/Box+breathing.gif"
          }
        ],
        "code": [
          {
            "id": "001",
            "language": "",
            "content": ["laboris"]
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Inhale along the left for 4 seconds",
              "Exhale along the top for 4 seconds",
              "Inside the along the right for 4 seconds",
              "Exhale along the bottom for 4 seconds"
            ],
            "list_type": "ordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Training"
        },
        "paragraphs": [
          "Navy Seals train in such a way to help them control their breathing not only to stay calm, but to also conserve energy. It starts with breathing and proper breathing. Proper breathing begins with breathing through the nose and out the mouth. We heard this before early in our sports career. Little that we know, that is very beneficial to our health. The benefits are: :listPlace(001)",
          "Here is a workout or things to do while working out that I believe will help with teaching yourself proper breathing and self control. 100s of pushups, burpees and squats. While at the bottom of a squat just breathe deep inhales, so that you will fill your lungs and slow exhales. The reasoning behind this is because shallow breaths leads to: :listPlace(002)",
          "While running, fill your lungs by breathing in through your nose only after each run or after each set. Sharp inhales through the nose and soft exhales through the mouth or nose."
        ],
        "images": [
          {
            "id": "001",
            "alt": "image1",
            "caption": "Breathing Counter",
            "link": "https://images.squarespace-cdn.com/content/v1/5b8645f7266c07b084eb29c7/1570208020992-TRZCAX5P0A53CG0LS5AO/Box+breathing.gif"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Reduces exposure to foreign substances",
              "Increases oxygen uptake and circulation",
              "Aids our immune system",
              "Slows down breathing",
              "Improves lung volume",
              "Humidifies inhaled air"
            ],
            "list_type": "unordered"
          },
          {
            "id": "002",
            "items": [
              "Increased blood pressure",
              "Increased stress response",
              "Reduced oxygen intake",
              "Impaired thinking",
              "Slower recovery"
            ],
            "list_type": "unordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Finally"
        },
        "paragraphs": [
          "Start small! :listPlace(001)",
          "Link to the Twitter 🧵 : :linkPlace(001)"
        ],
        "links": [
          {
            "id": "001",
            "text": "Navy SEALs are the world's most elite warriors",
            "link": "https://twitter.com/tobi_emonts/status/1577998885125033985?s=20&t=aJC2U0dfO1wUkyJpjw1lzQ"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Break up your big goals into small chunks, one breath at a time",
              "Breath control is stress control"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "docker-getting-started",
    "title": "Getting Started with Docker",
    "description": "Learn how to get started with Docker with this helpful article! It covers the basics of installation and usage, and provides tips for creating and running containers.",
    "date": "1667624400000",
    "tags": [
      "Technology",
      "Docker"
    ],
    "image": {
      "name": "images/docker.png",
      "alt": "docker-image"
    },
    "time": {
      "secs": "44",
      "mins": "00",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Initial Steps to Running Docker"
        },
        "paragraphs": [
          ":imagePlace(001)",
          "The lightweight development platform that we should all use as developers is Docker. What is Docker? Well, Docker is a software platform for building applications based on containers. Containers are small and lightweight execution environments that make shared use of the operating system kernel but otherwise run in isolation from one another. What is the difference between an image and a container? An image is a portable, read-only, executable file containing the instructions for creating a container. This image gets created using a dockerfile. What is also included in these instructions are operating system, languages, environmental variables, file locations, network ports, and any other components it needs to run.",
          "If you have installed docker on your pc or mac. The steps to run a docker container are as follows: :listPlace(001)",
          "Creating a dockerfile and building and running it. Here's an example of a basic dockerfile :codePlace(001)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "docker",
            "caption": "Docker @ Resource from Docker Website",
            "link": "https://www.ondat.io/hubfs/Docker.png"
          }
        ],
        "code": [
          {
            "id": "001",
            "language": "docker",
            "title": "docker_file",
            "content": [
              ":comment # Parent Image: Software and version",
              ":code-specific FROM :code-specific-end python:3",
              ":code-specific WORKDIR :code-specific-end :path-start /Users/user_directory/docker/textblob :path-end",
              ":code-specific COPY :code-specific-end requirements.txt :path-start ./ :path-end",
              ":code-specific RUN :code-specific-end pip install --no-cache-dir -r requirements.txt",
              ":comment # First dot is relative file path where dockerfile resides",
              ":comment # Second dot is the root directory",
              ":code-specific COPY :code-specific-end . .",
              ":code-specific CMD :code-specific-end :bracket-open [ :string-open \"python :string-close\", :string-open \"./main.py :string-close\" :bracket-close ]"
            ]
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "Docker Help",
            "link": ""
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Create a docker",
              "Build docker image \" docker build -t :user-defined-code image:end . \"",
              "Run the docker container \" docker run --name :user-defined-code container_name image:end \"",
              "Stop container \"docker stop :user-defined-code container_name:end \"",
              "List running containers \"docker ps -a \""
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "jenkins-getting-started",
    "title": "Basics of Jenkins",
    "description": "Learn the basics of Jenkins, an open source automation server for continuous integration and continuous delivery. Get up and running quickly and easily.",
    "date": "1675365300000",
    "tags": [
      "Technology",
      "Jenkins",
      "CI/CD"
    ],
    "image": {
      "name": "images/jenkins.png",
      "alt": "jenkins-image"
    },
    "time": {
      "secs": "06",
      "mins": "01",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Creating a Jenkinsfile"
        },
        "paragraphs": [
          ":imagePlace(001)",
          "When creating a Jenkinsfile the necessary fields must are: pipeline, agent, stages. \"pipeline\" is always needed and is at the top-level. From here we have the \"agent\" which describes where to execute (default would be set to any). Then we have stages which describes where the works happens, and within \"stages\" you define \"stage\" that will have parameters such as: (\"init\"), (\"build\"), (\"test\"), and (\"deploy\").",
          "Another field that may be added and this is added after \"stages\". This is \"post\" and what this does is execute some logic after all stages have executed. The conditions that are within the \"post\" section are: always, success, failure. Always will always execute whether the script failed or not. Examples of this are sending emails out to the team after a build."
        ],
        "images": [
          {
            "id": "001",
            "alt": "jenkins",
            "caption": "Jenkins Image from Jenkins Website",
            "link": "https://www.jenkins.io/images/logo-title-opengraph.png"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Adding Environmental Variables"
        },
        "paragraphs": [
          "In order to add environmental variables to your file, before \"stages\" you need to add \"environment\" into your pipeline.",
          ":codePlace(001)"
        ],
        "code": [
          {
            "id": "001",
            "language": "groovy",
            "title": "jenkins_file_env",
            "content": [
              "pipeline {",
              "\tagent any",
              "\tenvironment {",
              "\t\tEXAMPLE_VAR = 'Something'",
              "\t}",
              "\t...",
              "}"
            ]
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Adding Build Tools for Project"
        },
        "paragraphs": [
          ":codePlace(001)"
        ],
        "code": [
          {
            "id": "001",
            "language": "groovy",
            "title": "jenkins_file_tools",
            "content": [
              "pipeline {",
              "\tagent any",
              "\ttools  {",
              "\t\tnodejs 'NodeJS'",
              "\t}",
              "\t...",
              "}"
            ]
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Building Jenkinsfile"
        },
        "paragraphs": [
          "After this you would then go to Jenkins localhost webpage and create a new job. Depending on the version of Jenkins you have downloaded this menu may be different. What you should see is a text field and beneath a list of types of projects you can create. The projects are Freestyle project, Pipeline, Multi-configuration project, Folder, GitHub Organization, and Multibranch Pipeline. For my example I am using Multibranch Pipeline.",
          "Within the General Tab, scroll down to Branch Sources and add the link to the Git project repository and add the correct credentials. You can determine what branches you want to build by selecting the next drop-down. Click build and you should now be presented with a new page that displays the pipeline output/log."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Final Results"
        },
        "paragraphs": [
          ":codePlace(001)"
        ],
        "code": [
          {
            "id": "001",
            "language": "groovy",
            "title": "jenkins_file_final",
            "content": [
              "def gv",
              "pipeline {",
              "\tagent any",
              "\tparameters {",
              "\t\tchoice(name: 'VERSION', choices: ['1.1.0', '1.2.0', '1.3.0'], description: '')",
              "\t\tbooleanParam(name: 'executeTests', defaultValue: true, description: '')",
              "\t}",
              "\tstages {",
              "\t\tstage (\"init\") {",
              "\t\t\tsteps {",
              "\t\t\t\tscript {",
              "\t\t\t\t\tgv = load \"script.groovy\"",
              "\t\t\t\t}",
              "\t\t\t}",
              "\t\t}",
              "\t\tstage (\"build\") {",
              "\t\t\tsteps {",
              "\t\t\t\tscript {",
              "\t\t\t\t\tgv.buildApp()",
              "\t\t\t\t}",
              "\t\t\t}",
              "\t\t}",
              "\t\tstage (\"test\") {",
              "\t\t\twhen {",
              "\t\t\t\texpression {",
              "\t\t\t\t\tparams.executeTests",
              "\t\t\t\t}",
              "\t\t\t}",
              "\t\t\tsteps {",
              "\t\t\t\tscript {",
              "\t\t\t\t\tgv.testApp()",
              "\t\t\t\t}",
              "\t\t\t}",
              "\t\t}",
              "\t\tstage (\"deploy\") {",
              "\t\t\tsteps {",
              "\t\t\t\tscript {",
              "\t\t\t\t\tgv.deployApp()",
              "\t\t\t\t}",
              "\t\t\t}",
              "\t\t}",
              "\t}",
              "}"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "system-design",
    "title": "Help with System Design Interviews",
    "description": "System design study focuses on understanding user requirements, creating system architecture and developing a plan for implementation.",
    "date": "1675836000000",
    "tags": [
      "System Design",
      "Technology",
      "MAANG"
    ],
    "image": {
      "name": "images/web-dev.png",
      "alt": "web-dev-img"
    },
    "time": {
      "secs": "12",
      "mins": "07",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Preparation for the Interview"
        },
        "paragraphs": [
          ":imagePlace(001)",
          "Why system design? System design aims to build systems that are reliable, effective, and maintainable. Reliable systems handle faults, failures, and errors.  Effective systems meet all user needs and business requirements. Maintainable systems are flexible and easy to scale up or down. The ability to add new features also comes under the umbrella of maintainability.",
          "Preparing for system design interviews can be helpful when you have help from some of the big tech companies. Some companies share some of their technical details on tech blogs that are given to the public. Their reason for sharing this information is to encourage and challenge any future employees to problem solve and to gain an understanding of what it's like working at their company. The tech blogs are :linkPlace(001), :linkPlace(002), :linkPlace(003), :linkPlace(004), :linkPlace(005), :linkPlace(006), :linkPlace(007), :linkPlace(008), :linkPlace(009), :linkPlace(010), :linkPlace(011), :linkPlace(012), and :linkPlace(013).",
          "Some thoughts that should happen when designing a system should be “Why does this system works?”. Look into why some of the popular applications works at a high level. Understand why some component was used instead of another. Build serious side projects and improve on them and refine them. Build a system from scratch and get familiar with all the processes and details of its construction."
        ],
        "images": [
          {
            "id": "001",
            "alt": "system-design",
            "caption": "Load Balancing from G4G",
            "link": "https://media.geeksforgeeks.org/wp-content/uploads/20200824215825/LoadBalancingSystemDesign.png"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "Engineering at Meta",
            "link": "https://engineering.fb.com/"
          },
          {
            "id": "002",
            "text": "Meta Research",
            "link": "https://research.fb.com/"
          },
          {
            "id": "003",
            "text": "AWS Architecture Blog",
            "link": "https://aws.amazon.com/blogs/architecture/"
          },
          {
            "id": "004",
            "text": "Amazon Science Blog",
            "link": "https://www.amazon.science/blog"
          },
          {
            "id": "005",
            "text": "Netflix TechBlog",
            "link": "https://netflixtechblog.com/"
          },
          {
            "id": "006",
            "text": "Google Research",
            "link": "https://research.google/"
          },
          {
            "id": "007",
            "text": "Engineering at Quora",
            "link": "https://quoraengineering.quora.com/"
          },
          {
            "id": "008",
            "text": "Uber Engineering Blog",
            "link": "https://eng.uber.com/"
          },
          {
            "id": "009",
            "text": "Databricks Blog",
            "link": "https://databricks.com/blog/category/engineering"
          },
          {
            "id": "010",
            "text": "Pinterest Engineering",
            "link": "https://medium.com/@Pinterest_Engineering"
          },
          {
            "id": "011",
            "text": "BlackRock Engineering",
            "link": "https://medium.com/blackrock-engineering"
          },
          {
            "id": "012",
            "text": "Lyft Engineering",
            "link": "https://eng.lyft.com/"
          },
          {
            "id": "013",
            "text": "Salesforce Engineering",
            "link": "https://engineering.salesforce.com/"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Stay on track"
        },
        "paragraphs": [
          "At all costs, avoid going to the lower level! What this mean for example is to make sure you are having discussions about traditional databases like MySQL or NoSQL. This helps with creating conversations about the trade-offs of the two databases.",
          "Key things to remember when thinking of deliverables expected from the developed design :listPlace(001)"
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Functional requirements: These represent the features a user of the designed system will be able to use. For example, the system will allow a user to search for content using the search bar.",
              "Non-functional requirements (NFRs): The non-functional requirements are criteria based on which the user of a system will consider the system usable. NFR may include requirements like high availability, low latency, scalability, and so on."
            ],
            "list_type": "ordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "The Interview"
        },
        "paragraphs": [
          "When going into an interview remember that the interview has ask these questions to other candidates. So, don't produce a design that sounds the same as other candidates.",
          "The most recommended strategy to use in a design interview is to ask refining questions, handle the given data, discussing the components, and finally discussing trade-offs. First thing you want to do is better understand the system planning to design is by asking refining questions. We need to find the functional and nonfunctional requirements. For example, the ability to send messages in near real-time to friend's vs messaging service performance shouldn't degrade with increasing user load. To better understand the data, we should ask the following questions: :listPlace(001)"
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "What is the size of the data right now? (Guessing this is the size of data type)",
              "At what rate is the data expected to grow over time?",
              "How will the data be consumed by other subsystems or end users?",
              "Is the data read-heavy or write-heavy?",
              "Do we need strict consistency of data, or will eventual consistency work?",
              "What is the durability target of the data?",
              "What privacy and regulatory requirements do we require for storing or transmitting user data?"
            ],
            "list_type": "unordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Abstraction"
        },
        "paragraphs": [
          "Abstraction is the process of hiding details that we don't need. Abstractions in distributed systems helps with simplifying their work and relieve them od the burden of dealing with the underlying complexity of the system."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Remote Procedure Calls"
        },
        "paragraphs": [
          "Remote Procedure Calls (RPC) is an inter-process communication protocol that's widely used in distributed systems. Developers can use the RPC method without knowing the network communication details. As a result, they can concentrate on the design aspects, rather than the machine and communication-level specifics."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Consistency"
        },
        "paragraphs": [
          "Consistency is having the same state across all different systems in the distributed system. A strong consistency means that our system is never in an inconsistent state, but at a cost of lower performance and availability because the systems must stay consistent with each other. Eventual consistency is having the system in an inconsistent state for some time but will eventually be in a consistent state. This is also the weakest of the consistencies. There are drawbacks from both. Let's use a YouTube example. Say if you have (n) number of users and one or more users watch a video. We must update the view counter every time a user watches a video, but we have other users that want to read the view count. If we use the strong consistency, we will have to be happy with a long wait time for the other users to read the view value of the video. This is mainly because you must replicate the data across multiple database servers which can be over many miles away from each other and possibility in many different geographic locations. Rather if we use the eventual consistency, we will have to be happy with stale servers (servers that haven't been updated with the current value). This will help with keeping the service up in running without users losing any time. In an interview describe both cases pros and cons. Stock market or updating are a good use for a strong consistency and YouTube is a good use of eventual consistency.",
          "There is another consistency in between these two consistencies. One being casual consistency and the other being sequential consistency with casual being the weaker of the two. Casual works by categorizing operations into dependent and independent operations. A dependent operation is used to preserve the order of the operations. If one operation is dependent on another the independent operation must run first before the dependent. For example, in order to reply to a comment a comment must be created first before the reply. This is used to prevent non-intuitive behavior such as replying to a comment that doesn't exist which will cause a long weight. Sequential consistency ensures that the ordered specified by the client program has been preserved. The downfall is that the user may not be able to read instantaneously or in the order that the write occurred. Example of this is a social network application, we usually don't care about the order in which some of our friends' posts appear. However, we still anticipate a single friend's posts to appear in the correct order in which they were created). Similarly, we expect our friends' comments in a post to display in the order that they were submitted. The sequential consistency model captures all of these qualities."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Availability"
        },
        "paragraphs": [
          "Availability is the percentage of time that some service or infrastructure is accessible to clients and is operated upon under normal conditions. Each service provider may start measuring availability at different points in time. Some cloud providers start measuring it when they first offer the service, while some measure it for specific clients when they start using the service. Some providers might not reduce their reported availability numbers if their service was not down for all the clients. The planned downtimes are excluded. Downtime due to cyberattacks might not be incorporated into the calculation of availability. Therefore, we should carefully understand how a specific provider calculates their availability numbers."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Reliability"
        },
        "paragraphs": [
          "Reliability is the probability that the service will perform its functions for a specified time. Reliability measures how the service performs under varying operating conditions."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Scalability"
        },
        "paragraphs": [
          "Scalability is the ability of a system to handle an increasing amount of workload without compromising performance. A search engine, for example, must accommodate increasing numbers of users, as well as the amount of data it indexes. The workload can be of different types, including the following: :listPlace(001)",
          "There are two approaches to scalability. One being vertical scalability (scaling up) and the other being horizontal scalability (scaling out). Vertical scaling, refers to scaling by providing additional capabilities (for example, additional CPUs or RAM) to an existing device. Vertical scaling allows us to expand our present hardware or software capacity, but we can only grow it to the limitations of our server. This is pricier because of the need for expensive components. Horizontal scaling, refers to increasing the number of machines in the network. We use commodity nodes for this purpose because of their attractive dollar-cost benefits. The catch here is that we need to build a system such that many nodes could collectively work as if we had a single, huge server. :listPlace(002)"
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Request workload: This is the number of requests served by the system.",
              "Data/storage workload: This is the amount of data stored by the system."
            ],
            "list_type": "unordered"
          },
          {
            "id": "002",
            "items": [
              "Vertical Scaling = more space in a single system",
              "Horizontal Scaling = more nodes that need to be in sync with one another"
            ],
            "list_type": "unordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Maintainability"
        },
        "paragraphs": [
          "Is the ability to keep the system up and running by finding and fixing bugs, adding new functionalities, keeping the system's platform updated, and ensuring smooth system operations. Maintainability can be defined more clearly in close relation to reliability. The only difference between them is the variable of interest. Maintainability refers to time-to-repair, whereas reliability refers to both time-to-repair and the time-to-failure. Combining maintainability and reliability analysis can help us achieve availability, downtime, and uptime insights."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Fault Tolerance"
        },
        "paragraphs": [
          "Fault tolerance refers to a system's ability to execute persistently even if one or more of its components fail. Here, components can be software or hardware. Conceiving a system that is hundred percent fault-tolerant is practically very difficult. Fault tolerance can be achieved by many approaches, considering the system structure. We compromise either on availability or on consistency under failures—a reality that is outlined in the CAP theorem.",
          "Checkpointing is a technique that saves the system's state in stable storage when the system state is consistent. Checkpointing is performed in many stages at different time intervals. The primary purpose is to save the computational state at a given point. When a failure occurs in the system, we can get the last computed data from the previous checkpoint and start working from there. When the system has to perform checkpointing, it makes sure that the system is in a consistent state, meaning that all processes are stopped except read processes that do not change the state of the system. This type of checkpointing is known as synchronous checkpointing. On the other hand, checkpointing in an inconsistent state lead to data inconsistency problems."
        ]
      },
      {
        "title": {
          "tag": "h2",
          "text": "Back-Of-The-Envelope"
        },
        "paragraphs": [
          "This is a very usual tool in your system design toolbox. The purpose of the back-of-the-envelope calculation for quick sanity check of the design. Absolute accuracy is not important rather than good enough. Remember that we have a variety of servers for providing various services within a data center.",
          "For example, if the math says that our service will need to handle about 1,000,000 requests per second. We find out our web server can only handle 10,000 request per second. What did we learn from this? We learn that we will need a cluster of web servers and we would need a load balancer. 1,000,000 / 10,000 = 100 servers.",
          ":imagePlace(001)",
          ":imagePlace(002)",
          ":imagePlace(003)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "system-design-db-rates",
            "caption": "Database Rates",
            "link": "/images/system-design/database_rates.png"
          },
          {
            "id": "002",
            "alt": "system-design-latency-rates",
            "caption": "Latency Rates",
            "link": "/images/system-design/latency_values.png"
          },
          {
            "id": "003",
            "alt": "system-design-server-specs",
            "caption": "Server Specs",
            "link": "/images/system-design/server_specs.png"
          }
        ]
      }
    ]
  },
  {
    "id": "thankfulness",
    "title": "Command for Thankfulness",
    "description": "devotional from my morning reading on thankfulness and why we should always be thankful.",
    "date": "1678428000000",
    "tags": [
      "Christ",
      "Salvation",
      "Love",
      "Thankful"
    ],
    "image": {
      "name": "images/thankful.png",
      "alt": "thankful-icon"
    },
    "time": {
      "secs": "20",
      "mins": "01",
      "hours": "00"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Command for Thankfulness"
        },
        "paragraphs": [
          "We seldom give thanks during all seasons of life. We give praises to God when things are well as we should, but not when things aren’t. Prime example of this in scripture is Israel’s ungrateful heart throughout their time in the wilderness (Num. 14:1-4;20:3-5). Also, remember this is after God hears their groaning in Egypt and rescues them out of the harness that they faced while there (Ex. 2:24-25).",
          "The harshness that the Israelites faced in Egypt was bad and continued to get worse as Pharaoh saw how they were multiplying (Ex. 1:8-15). Even when God had blessed Israel abundantly with manna and protection in the wilderness, they still thought it was better to go back and enjoy the life they had there with all the food (Num. 11:5). They’re not the only ones that think this way.",
          "As I read Col. 3:15, Paul commands the saints in Colossae to be thankful. This would seem like a weird command because you would think that we should always be thankful. Paul here reminds the believer to be thankful after just telling them to put on these godly characteristics (Col. 3:12-14). Why should we then be thankful? Why this command? I believe Paul wants us to remember the mercy of God in saving us from the bondage of sin that once enslaved us. The believer may grumble about these characteristics that they have to put off (Col. 3:5-11) which they prided themselves in having before the saving grace of Christ or because they’ve been wrong by someone and that person deserves it. As I was reminded by a brother, “We deserve much worse than what this person just said about us even though it may not be true.” God did not need to save Israel from Egypt nor did he need to save us from our sins.",
          "So, to close as the Apostle Paul commands, “Be Thankful”. We ought to always be thankful in all circumstances because we deserve much more than we are receiving."
        ],
        "images": [],
        "links": [],
        "lists": []
      }
    ]
  },
  {
    "id": "debugging-in-node",
    "title": "Debugging in NodeJS",
    "description": "How to properly debug in NodeJS",
    "date": "1680066000000",
    "tags": [
      "Technology",
      "Engineer"
    ],
    "image": {
      "name": "images/web-dev.png",
      "alt": "web-dev-img"
    },
    "time": {
      "secs": "57",
      "mins": "0",
      "hours": "0"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Debugging in Node Using Chrome Devtools"
        },
        "paragraphs": [
          "As I’m writing this the current Node version is 16.13. Debugging in NodeJS is a good trick to know how to do when you’re a web developer. It is done by adding simply :special-text(key=italic,--)special-text-end :special-text(key=italic,inspect )special-text-end flag. What happens is that when using :special-text(key=italic,--)special-text-end :special-text(key=italic,inspect )special-text-end flag Node opens a port to accept WebSocket connections. Now you will be presented with the following::imagePlace(001)",
          "Once successful, now open up Google Chrome and type the following URL :special-text(key=italic,chrome)special-text-end :special-text(key=italic,://)special-text-end :special-text(key=italic,inspect)special-text-end :special-text(key=italic,/#)special-text-end :special-text(key=italic,devices)special-text-end . This will present you with a DevTools webpage that allows you to debug your node project.  Click Configure… which should open up a window in which you can see the discoverable ports on your PC. You should now see a remote target added to your DevTools dashboard. Click inspect and a new window should appear.",
          "One problem I had was getting the file to appear. In order to get it to appear I have to find the file by using CTRL-P and searching for the file. The location of mine was at the end of the list. Now you can debug away by adding breakpoints and running your application. While debugging you can hover over various variables in your code to find the problem. You will also notice arrows for stepping in and out of functions that are very useful."
        ],
        "images": [
          {
            "id": "001",
            "alt": "",
            "caption": "node --inspect snippet",
            "link": "/images/articles/node-inspect.png"
          }
        ],
        "code": [],
        "links": [],
        "lists": []
      },
      {
        "title": {
          "tag": "h2",
          "text": "Setting up Stack Trace"
        },
        "paragraphs": [
          "The basics behind displaying stack trace is simple in node. All one would have to do is."
        ],
        "images": [],
        "code": [],
        "links": [],
        "lists": []
      },
      {
        "title": {
          "tag": "h2",
          "text": "Soli Deo Gloria"
        },
        "paragraphs": [],
        "images": [],
        "code": [],
        "links": [],
        "lists": []
      }
    ]
  },
  {
    "id": "depth-first-search",
    "title": "Depth First Search",
    "description": "Article on the depth first search definition and its usage for a tree and a graph.",
    "date": "1691730000000",
    "tags": [
      "Data Structures",
      "Algorithms",
      "Tech Interview"
    ],
    "image": {
      "name": "images/algorithm.png",
      "alt": "algo-img"
    },
    "time": {
      "secs": "14",
      "mins": "2",
      "hours": "0"
    },
    "type": "article",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Introduction"
        },
        "paragraphs": [
          "In this article, I will define the :special-text(key=bold,Depth )special-text-end :special-text(key=bold,First )special-text-end :special-text(key=bold,Search )special-text-end :special-text(key=bold,()special-text-end :special-text(key=bold,DFS)special-text-end :special-text(key=bold,) )special-text-end algorithm. I will be explaining the definition and the uses of the search on a tree and a graph."
        ],
        "images": [],
        "code": [],
        "links": [],
        "lists": []
      },
      {
        "title": {
          "tag": "h3",
          "text": "Definition"
        },
        "paragraphs": [
          "DFS is a tree and graph traversal algorithm used to explore node(s) in a tree or graph data structure. Depending on the data structure a node will have different meaning in regards to the relationship with other nodes. For example, a node in a tree is a single element in a tree that will either be connected to another node via parent-child relationship. While a node in graph will be connected to other nodes via neighbor relationship. ",
          "DFS on a tree has three traversal methods: pre-order, in-order, and post-order. These tree traversals generally go from left to right. In the pre-order traversal, we would start from the current node, then traverse the left subtree, and finally traverse the right subtree. In-order traversal, we would start from the root node and traverse the left subtree, then the current node, and finally traverse the right subtree. The last traversal method post-order traversal, we would start from the root node and traverse the left subtree, then the right subtree, and finally visit the current node. Below is an example of in-order traversal these steps are basis for how each traversal method operates::listPlace(001)",
          "We now get into using these same traversals with a graph data structure. The main difference in using these traversal methods with graphs are that you have to mark each visited node. The reason for the marking of nodes because graph contains cycles and we don’t want to get stuck in an infinite loop."
        ],
        "images": [],
        "code": [],
        "links": [],
        "lists": [
          {
            "id": "001",
            "items": [
              "Traverse the left subtree",
              "Visit the current node",
              "Traverse the right subtree"
            ],
            "list_type": "ordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h3",
          "text": "Uses"
        },
        "paragraphs": [
          "\tWhen determining when to use the following algorithm we chose by first understanding if the problem is a tree/graph problem or not. This can be difficult at first because all tree/graph problem don’t just same “I’m a tree” or “I’m a graph”. Determining whether a problem is a tree/graph is done by understanding what the problem is asking just like any other algorithm. Generally identifying DFS problem you will notice whether the question is asking for the following::listPlace(001)",
          "The strategy to determining which traversal methods to use depends on the algorithm that is being design. When thinking about picking pre-order method, you may be thinking of exploring the root prior to the leaves. While using post-order method, you may be thinking of exploring the leaves before the root. In-order is best used, when you know that the tree has a sequence in the nodes."
        ],
        "images": [],
        "code": [],
        "links": [],
        "lists": [
          {
            "id": "001",
            "items": [
              "Max Depth of Tree, *anything* tree",
              "Combination Search :listPlace(002)"
            ],
            "list_type": "unordered"
          },
          {
            "id": "002",
            "items": [
              "“Generate all possible”",
              "“Number of ways”"
            ],
            "list_type": "unordered"
          }
        ]
      },
      {
        "title": {
          "tag": "h3",
          "text": "Implementation"
        },
        "paragraphs": [
          "\tTo implement DFS algorithm is simple for both a tree and a graph. It is implemented just as it is defined. See the example below written in Python::codePlace(001)",
          "\tThe difference in the implementation for a tree and a graph is including a visited set as a state. In the implementation of DFS in a graph you will add a visited set to store all the vertices/nodes that were already visited. Since a graph uses a visited set, you no longer need to used the goal state that a tree would used to find a left node. The python example below shows the basic implementation to start from: :codePlace(002)"
        ],
        "images": [],
        "code": [
          {
            "id": "001",
            "title": "DFS Implementation for Tree Traversal",
            "language": "python",
            "content": [
              "def dfs(root):",
              "\tif not root:",
              "\t\treturn",
              "\t# Traverse the left subtree",
              "\tdfs(root.left)",
              "\t# Visit current node",
              "\tprint(root)",
              "\t# Traverse the right subtree",
              "\tdfs(root.right)",
              "\treturn"
            ]
          },
          {
            "id": "002",
            "title": "DFS Implementation for Graph Traversal",
            "language": "python",
            "content": [
              "def dfs(root, visited):",
              "\t# Visit all neighbors",
              "\tfor neighbor in get_neighbors(root):",
              "\t\t# Check if neighbor has been visited before",
              "\t\tif neighbor in visited:",
              "\t\t\tcontinue",
              "",
              "\t\t# Add neighbor to visited set",
              "\t\tvisited.add(neighbor)",
              "",
              "\t\t# Add neighbor to stack",
              "\t\tdfs(neighbor, visited)"
            ]
          }
        ],
        "links": [],
        "lists": []
      }
    ]
  },
    {
    "id": "theology-103-week-5",
    "title": "Theology 103",
    "description": "week 5 of Theology 103 course",
    "date": "1644825601000",
    "tags": [
      "Theology",
      "Christ",
      "Sin",
      "Angels",
      "Demons"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "36",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Week 5: Humans and Sin, Angels and Demons"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)",
          "I still have questions on the following: :listPlace(002)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Satan can serve God's purposes in the realm of church discipline when repentance remains absent",
              "Believers are to gird up the loins with truth which show they have a heart for battle because of their commitment to Christ",
              "God has provided the breastplate of righteousness to protect the believer's mind and emotions",
              "Though Satan and one-third of the angel disqualified themselves from servest to the LORD, they weren't completely banned from heaven",
              "Satan will only bruise Christ heel (cause Him to suffer), while Christ will bruise Satan's head (destroy him with a fatal blow)",
              "When someone is demonize, the demon exercise living and dominant control over that person",
              "The sealing ministry of the Holy Spirit protects Christians against demon invasion, and its unbiblical and impossible for a true believer to have a demon invasion",
              "Demonization refers to the only unbelievers in whom a demon resides",
              "Believers can be tormented, oppressed, and harassed externally, even to to severe degree like Saul",
              "A demon is far more powerful than a human so we must trust the appeal to God in prayer to deal with situation of demonization",
              "The angel of the LORD has been identified as a special created angel, some say Michael the archangel, but no created angel has ever show traits of deity",
              "Also the angel of the LORD is a self-manifestation of Yahweh himself",
              "The angel of the LORD showed traits of deity (Ex, 3:2-5; Judg. 13:17-18; Ex. 23:21;33:14; Isa. 63:9)",
              "The identification of the angel of the LORD matches the NT explanation of the preincarnate Christ",
              "The words uttered by Christ asserts that He was the angel of the LORD mentioned in the OT because it asserts that more than one person can be God",
              "The attributes of the OT angel of the LORD compare perfectly with those of Christ"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "How can demons be pictured in today's age, such as in a homeless person who is talking to themselves, or can it be your average person?",
              "If one is demon possessed what do we do as Christians?",
              "Will the Antichrist be some type of leader like the king of Babylon in Isaiah 14?",
              "What portion in man's sinful action is Satan or demon deception; or just the man's own sinfulness? (The Devil made me do it theology)"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-103-week-4",
    "title": "Theology 103",
    "description": "week 4 of Theology 103 course",
    "date": "1644220801000",
    "tags": [
      "Theology",
      "Christ",
      "Sin",
      "Angels",
      "Demons"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "38",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Week 4: Humans and Sin, Angels and Demons"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)",
          "I still have questions on the following: :listPlace(002)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Angels(both holy and evil) were created at the start of creation and the demons fell somewhere after the seven day creation and prior to the fall. They existed with a set number and 1/3 of them falling",
              "The term “heaven” in scripture describes three different elevation levels above earth.",
              "“Third heaven” normally known as paradise where God resides",
              "“Second heaven” where the sun, moon, and stars reside",
              "“First heaven” earth's atmosphere",
              "Angels are ministering spirits this is presented in Heb. 1:14",
              "“God of this world” is Satan and he has superior power, but not deity. This title comes by virtue not his position nor his nature. The reason behind the title is Satan's work in the garden that cause the fall, and he is behind all false religions",
              "Satan's messages and activities are all built on deception and lies (1 Ki. 22:21-23)",
              "God used Satan to deceive Israel's King Ahab to go into battle which led to Ahab's death",
              "Satan and other demonic minions were most intensely engaged during Christ's earthly ministry",
              "Satan operates as the unrivaled master of disguise who also mimics and imitates the holy things of God, but gives his cheap version, which lures people to himself",
              "Satan wages an invisible spiritual war using deceitful and clever tactics",
              "Satan's target is the human mind more importantly the Christian's mind as he plays mind games with them",
              "Satan attempt to distort or deny the truth God's Word by sensualism, sensationalism, universalism, rationalism, existentialism, illusionism, ecumenism, humanism",
              "The question that Satan asked Eve in the garden was not a research question, but rather a ridicule",
              "Ex: You've got to be kidding, Eve. God didn't really say you can't eat from any tree in the garden, did he?",
              "In the moment when Eve was deceived God's Word was no longer authoritative in her life now that she had an alternative"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "How can demons be pictured in today's age, such as in a homeless person who is talking to themselves, or can it be your average person?",
              "If one is demon possessed what do we do as Christians?",
              "Will the Antichrist be some type of leader like the king of Babylon in Isaiah 14?",
              "What portion in man’s sinful action is Satan or demon deception; or just the man’s own sinfulness? (The Devil made me do it theology)"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-103-week-3",
    "title": "Theology 103",
    "description": "week 3 of Theology 103 course",
    "date": "1643616001000",
    "tags": [
      "Theology",
      "Christ",
      "Sin"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "00",
      "mins": "02",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Week 3: Humans and Sin, Angels and Demons"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "Since the enlightenment, humans have thought of themselves as inherently \"good\".",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)",
          "I still have questions on the following: :listPlace(002)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Society presents sin as stemming from the personal environment they grew up in. So if you grew up in a rough environment you are likely to be a greater sinner than someone in a good environment.",
              "From a biblical understanding sin is man usurping God's authority and acting as they are autonomist",
              "Both Satan and Adam were unsatisfied with their perfect condition, and the rebelled and desired to be like God",
              "There are three types of death: spiritual death(every unbeliever), physical death(everyone will face unless they are raptured), eternal death(final result for the unbeliever)",
              "Original sin not only includes the first sin that Adam commit, but also it include the state of people who descended from Adam",
              "Transmission of Adam sin seems to be best fit with the representative view. Representative headship asserts that the action of a representative results is seen as the action also for those united to him.",
              "The action of our federal head lead to not only a sinful nature, but also our condemnation, so in the same the action by our new federal head Christ we receive life. (Rom. 5; 1 Cor. 15)",
              "Total depravity does not conclude that man is not able to do good rather it teaches that the corruption of sin pollutes the person. Both body and spirit are corrupted by sin",
              "Man is not relatively neutral in which they are able to accept or reject God. Man is a hater of God who can not understand the things of God",
              "The \"sin that leads to death\" is a sin that lead to drastic chastisement",
              "Mortal and Venial sins are antithetical to the bible because it supposes that there are some sins that will not lead to condemnation which in turn leads to a faulty salvation",
              "The Roman Catholic idea of meritorious penance which is used for removal of mortal sin is an error and takes a blow at Christ atoning sacrifice for sin",
              "Personal sin does not break the bond between them and Christ, but they do have a negative impact on communion with Christ",
              "God created the world perfect, the reason the world is the way it is, is because man has to face the consequences for their sin",
              "The truth gives eternal perspective to our temporal sufferings in a fallen world"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "Is this denial from this British monk the reason why so many believe in free will?",
              "In understanding the a-mil or post-mil position on the end times, how can it be that the man of lawlessness isn't literally or has already come and deceived?",
              "Why was the woman promised the coming seed that would reverse the curse?",
              "Why did God not destroy all man again as he did in the flood even though man remained sinful as we see even Noah was sinful?"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-103-week-2",
    "title": "Theology 103",
    "description": "week 2 of Theology 103 course",
    "date": "1643011201000",
    "tags": [
      "Theology",
      "Christ",
      "Sin"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "53",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Week 3: Humans and Sin, Angels and Demons"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "Since the enlightenment, humans have thought of themselves as inherently \"good\".",
          "These are the following learning that I was grateful to learn about this week in my study on humans and sin: :listPlace(001)",
          "I still have questions on the following: :listPlace(002)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": ""
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Anthropology helps me with understanding who I am as a person. This answers the question of why we all are here.",
              "Anthropology also helps with dealing with the time such as what Charles Spurgen dealt with evolution starting with Charles Darwin. This is where I am happy to learn about sudden creationism",
              "I noticed while going through Genesis 1 were the terms created, made, and formed. This was eye opening because I sometimes can gloss over these terms while reading and miss God's magnificent glory in creation",
              "Imago Dei is a unique difference that we humans possess that all other creatures and animals don't possess. We are his representation not in the divine sense, but in the sense of the Trinitrian nature how we live in relationship with others",
              "Our conscience can get overridden by lies and errors which in turn misinforms the conscience",
              "Scripture seems to support dichotomy and trichotomy where sometimes soul and spirit are interchangeable and other times they are not so interchangeable, but mean different things",
              "Creationism argument when it comes to the origin of the soul fails to understand that Adam creation is a unique creation, so using him for the argument that both the soul and body were created at the same time is wrong.",
              "Deut. 22:5 supports that God expects that said person to live according to the gender He granted them at birth",
              "After the creatures were created God seemed to still create Adam a helper, so we see that the creatures and animals weren't suitable for him",
              "Homosexual unions cannot be rightly seen as marriages because it goes against God meaning for marriage: :listPlace(003)",
              "Ex. 21:22-25 presents a strong case for life starting in the womb because of the severity of the punishment if the child in the mother is harmed.",
              "The soul/spirit lives in an intermediate state between death and bodily resurrection"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "Can one human constitution affect another human constitution?",
              "Similar to man initial command and go and fill the earth which they disobey which led to Gen. 11 in which they gathered in one place; is our command to go and make disciples of all nations can we be disobedient if we stick to trying to make disciples and our household and extended families?",
              "When talking about the role of government, is it wrong to disobey when they constitute something as being wrong such as the latest Canadian bill even though they are in place to punish people who do wrong?"
            ],
            "list_type": "ordered"
          },
          {
            "id": "003",
            "items": [
              "He create man and seen that man needed a companion and this companion must fulfill His command to procreate"
            ],
            "list_type": "unordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-102-week-6",
    "title": "Theology 102",
    "description": "week 6 of Theology 102 course",
    "date": "1639369440000",
    "tags": [
      "Theology",
      "Christ",
      "God"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "45",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "CHRISTOLOGY PT.2"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)",
          "I still have questions on the following: :listPlace(002)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Doxologies of the NT ascribe the same glory and honor to Christ as was the commonality to ascribe to God in the OT (1 Chr. 29:10-11;1 Pet. 4:11;2 Pet. 3:18)",
              "Jesus instructs His disciples to pray to Him(Jh. 14:14;15:16;16:23-24) and we look at those passage we see that He describes Himself as our mediator between God and man",
              "Christ in emptying Himself in Phil. 2 did not empty Himself of His deity, but rather emptying by addition, not subtraction, by becoming man",
              "The Son of God fully possessed His divine nature, attributes, and prerogatives, he did not fully express them. They were veiled to be revealed by Him when he wanted",
              "Christ surrender the glories from which He came, from being worshipped by saints and angels to mocked by men",
              "Both Jesus's divine nature and human nature possesses their own will. (Jh. 17:24) His divine will; (Mat. 26:39) His human will",
              "His limited knowledge such as in passage like Mark 13 is a result of His voluntary surrender of the independent use of His divine attributes",
              "Jesus was baptized in order to fulfill the Father's will. He in turned identified Himself with sinners to ultimately bear their sins",
              "Jesus veiling the truth in parables acted as both judgement and mercy for the hearers. Judgement because it kept them in darkness and mercy because He grant them to see the light of God",
              "God prepared mankind for the atoning substitutionary sacrifice;of Christ by providing the instructions about sacrifice",
              "The display of Jesus's glory is most often associated with His second advent, not His resurrection",
              "Glory in the minds of the prophets and apostles were mostly associated with Christ's resurrection",
              "The believers resurrection they share in the same glory",
              "Every believer is ultimately accountable to him (1 Cor. 3:10-15) which motivates us to please God",
              "At the fullness of time, God will gather together believers in the millennial kingdom",
              "The real glory of eternity is when believers will reside in the presence of the Lord"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "Is this denial from this British monk the reason why so many believe in free will?",
              "In understanding the a-mil or post-mil position on the end times, how can it be that the man of lawlessness isn't literally or has already come and deceived?",
              "Why was the woman promised the coming seed that would reverse the curse?",
              "Why did God not destroy all man again as he did in the flood even though man remained sinful as we see even Noah was sinful?"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-102-week-5",
    "title": "Theology 102",
    "description": "week 5 of Theology 102 course",
    "date": "1638636277590",
    "tags": [
      "Theology",
      "Christ",
      "God"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "27",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "CHRISTOLOGY PT.2"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "Christ is eternally begotten from the Father, this is not speaking that Christ had a beginning because that goes against John 1:2-3",
              "Begotten in an eternal sense is speaking of the relationship of the First and Second person of the Trinity",
              "The Holy Spirit is not begotten, but rather procession",
              "When talking about order in the Trinity we are not speaking of glory, majesty, or essence, but rather with relationship",
              "The word Trinity is not found in found in Scripture but it is based on the biblical verbiage presented",
              "The doctrine of the Trinity was formally articulated by the Councils of Nicea(AD 325) and Constantinople(AD 381), but weren't invented here",
              "The term arised to combat heresies that were arising from Gnosticism and Monarchianism",
              "Christ (Second person of the Trinity) was sent from the Father as a result of God's love for mankind (John 3:16)",
              "Christ has always existed as the Son of God but became a child only at the moment of His miraculous conception",
              "\"Son of God\" title was understood categorically by everyone as a title of deity",
              "Theophany meaning appearance of God usually is referred to the old testament and are seen in passage like Gen. 16: 7-3 and has to be seen through the author rather than the character",
              "As we read John 1:18 we see that \"no one has seen God...,he has made him known\" made known in greek ( ex geomai )",
              "Jesus (the Son of God) made the Father known to mankind",
              "We see Christ intervening in history when mankind rebelled along with establishing the Kingdom of God on earth",
              "The point of the word \"God-breathed\" points to the origin of Scripture which is the divine breath of the Holy Spirit",
              "The Son of God appears as the one speaking to the people both in the OT and NT",
              "Christ is the theophany giving revelation by means of His personal presence",
              "The Spirit plays a key role in the prophets' recording of the revelation they seen",
              "He who is the Word of God speaks all thing into existence and pronounces judgement"
            ],
            "list_type": "ordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-102-week-4",
    "title": "Theology 102",
    "description": "week 4 of Theology 102 course",
    "date": "1637969188145",
    "tags": [
      "Theology",
      "Trinity",
      "God"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "20",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "The Trinity"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "These are the following learning that I was grateful to learn about this week: :listPlace(001)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "The trinity is a doctrine stating that God is absolutely and eternally one essence subsisting in three distinct and ordered persons without any division or replication",
              "The trinity is defined using negative statements which is known as apophatic theology",
              "Division and replication both results in three gods which the Trinity is not stating in their definition :listPlace(002)",
              "Modes of subsistence reveals the personal properties that distinguish each member of the Trinity :listPlace(003)",
              "These relationships establish a definite order within the Trinity, so with respect to relationship ONLY not essence or glory. (1. Father, 2. Son, 3. Holy Spirit)",
              "Psalm 45:6-7 refers to the Messiah as \"God\" and is enthroned, having been anointed by \"God\"",
              "New Testament writer identify that Jesus is the Lord that the psalmist is speaking of in Psalm 110:1 :listPlace(004)",
              "The word one in the Hebrew \"ekhad\" affirms God's unity while also allowing for plurality. Gen 2:24 is a example \"one\" flesh even though there is two people",
              "OT presents the angel of Yahweh as Yahweh and also distinct from Yahweh :listPlace(005)",
              "Scripture presents a emphasis on the number three such as the seraphim in (Isa. 6:3)",
              "(Isa. 48:12-16) This passage from the Old Testament presents at least two distinct entities",
              "The early church saw the threefold blessing as an indication as three persons of the Trinity",
              "During the great commission Jesus told His disciples to baptize in the \"name\" which is singular :listPlace(006)"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "This will lead into many heresies hence the reasons of the cults of old and today",
              "Each person of the trinity possess equally the full and divine essence of God"
            ],
            "list_type": "unordered"
          },
          {
            "id": "003",
            "items": [
              "Father, Son, and Holy Spirit"
            ],
            "list_type": "unordered"
          },
          {
            "id": "004",
            "items": [
              "The Son is both elohim and adonai",
              "The Shema in Deuteronomy 6:7 allows for a plurality in God"
            ],
            "list_type": "unordered"
          },
          {
            "id": "005",
            "items": [
              "(Ex. 23:20-23) Yahweh sent the angel of Yahweh",
              "Wisdom may be depicted as a distinct entity, but NT writers speak of Christ as \"the wisdom of God\""
            ],
            "list_type": "unordered"
          },
          {
            "id": "006",
            "items": [
              "cf. Mat. 28:19"
            ],
            "list_type": "unordered"
          }
        ]
      }
    ]
  },
  {
    "id": "theology-102-week-3",
    "title": "Theology 102",
    "description": "week 3 of Theology 102 course",
    "date": "1637398837075",
    "tags": [
      "Theology",
      "Trinity",
      "God"
    ],
    "image": {
      "name": "images/bible-icon.png",
      "alt": "bible-icon"
    },
    "time": {
      "secs": "30",
      "mins": "01",
      "hours": "00"
    },
    "type": "note",
    "content": [
      {
        "title": {
          "tag": "h2",
          "text": "Attributes of God"
        },
        "paragraphs": [
          " :imagePlace(001)",
          "Here's what I learned this week studying the attributes/perfections of God: :listPlace(001)"
        ],
        "images": [
          {
            "id": "001",
            "alt": "biblical-doctrine",
            "caption": "MacArthur/Mayhue Biblical Doctrine",
            "link": "https://i.ibb.co/563qGkX/biblical-doctrine-cover-half.jpg"
          }
        ],
        "links": [
          {
            "id": "001",
            "text": "",
            "website": "laboris"
          }
        ],
        "lists": [
          {
            "id": "001",
            "items": [
              "God is not dependent on no one or nothing. This is a common thought that we as human love to think that we can give something to God or God is somehow wouldn't be God if we don't choose Him for our salvation",
              "God's immutability, this is something that I would've used to an Arminian brother or sister in understanding that since God doesn't change and He has decreed His elect from the being. I thought this would've been a good argument, but reading this section understanding that open theist and their disbelief in God's immutability.",
              "Immutability does not mean that God is static, nor that He doesn't act distinctly in time or possess true affections",
              "Anthropopathic language is God's figurative expression of how He explains His change in actions towards a person",
              "His infinitude with regard to time is eternity, and His infinitude with regard to space is omnipresence",
              "God can experience time, but he is not controlled, confined, or condition by time",
              "God upholds the created order by being in every point of space",
              "God does know what would have happened if circumstances would have been different, but they aren't possible because they are not apart of God's plan",
              "God's knowledge is perfect He is never learning, so He does not have to look into the future to see how would accept His salvation",
              "God's knowledge has two aspects: Natural knowledge and free knowledge: :listPlace(002)",
              "His natural knowledge is how He reveals himself to creation",
              "We as creation can know God through His free knowledge because He decrees of how He would reveal Himself to creation",
              "God's foreknowledge is not dependent on foresight of what humans would do",
              "Scripture reveals God's power (Eph. 3:20)",
              "God's power is that he has a theoretical absolute power to do more than what He actually does but not inconsistent with His essence",
              "Doctrine of divine perfection is the doctrine of divine blessedness"
            ],
            "list_type": "ordered"
          },
          {
            "id": "002",
            "items": [
              "Natural Knowledge: is His self-conscious knowledge of Himself",
              "Free Knowledge: all things that become known in time by His sovereign will, all things that do not become known in time, and how He is manifested and not manifested by all things outside of Him"
            ],
            "list_type": "unordered"
          }
        ]
      }
    ]
  }
];