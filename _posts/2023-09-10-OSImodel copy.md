---
title: "OSI Model"
date: 2023-09-10 17:00:00 +500
categories: []
tags: [] 
---

<style>
  p {
    text-align: justify;
  }
</style>

# OSI Model

The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes and describes the functions and processes involved in computer networking and data communication. It has seven layers and was developed by the International Organization for Standardization (ISO) in the late 1970s and early 1980s to provide a common reference point for designing and understanding network protocols and systems.

1. **Physical Layer:**
   The Physical Layer, the lowest layer of the OSI Model, is primarily concerned with the actual physical hardware components and transmission of raw, unstructured data bits across the network. It defines the physical characteristics of the transmission medium, including signal voltage levels, modulation schemes, and data rates. Additionally, the Physical Layer specifies the physical topology of the network, such as bus, star, or ring configurations. Common physical resources found at this layer include network cables, connectors, network adapters, hubs, repeaters, and modems.

2. **Data Link Layer:**
   At the Data Link Layer (Layer 2) of the OSI Model, directly connected nodes use devices and components to perform node-to-node data transfer. This layer packages data into frames, adds MAC addresses for source and destination identification, and handles flow control to ensure data is sent at a rate the receiver can manage. The Data Link Layer is often divided into two sub-layers: Logical Link Control (LLC) and Media Access Control (MAC). Devices and components commonly found at Layer 2 include Network Interface Cards (NICs), Switches, Bridges, Access Points (APs), Network Cables, MAC Addresses, Frames, and various Ethernet Standards.

3. **Network Layer:**
   The Network Layer is responsible for receiving frames from the Data Link Layer and delivering them to their intended destinations based on logical addresses, such as IP (Internet Protocol) addresses. Its primary function is routing, where routers play a crucial role in determining the best path for data packets to reach their destination. This layer also handles packet forwarding, fragmentation, and reassembly as needed when transmitting data between networks.

4. **Transport Layer:**
   The Transport Layer manages the reliable end-to-end delivery of data packets, ensuring they are delivered in the correct order and reliably. It regulates the size and sequencing of data packets transferred between systems and hosts. Notably, this layer distinguishes between connection-oriented protocols like TCP (Transmission Control Protocol) and connectionless protocols like UDP (User Datagram Protocol). It also provides flow control, error detection, and error correction mechanisms.

5. **Session Layer:**
   The Session Layer controls the establishment, maintenance, and termination of sessions or connections between different computers. It facilitates dialog control, allowing for full-duplex or half-duplex communication, and can provide services like checkpointing and recovery in case of network failures. Session Layer services also encompass user authentication, authorization, and the management of reconnections.

6. **Presentation Layer:**
   The Presentation Layer is responsible for data translation, encryption, and decryption, ensuring that data from the Application Layer is correctly formatted for transmission and vice versa. It also handles data compression and decompression and manages the syntax and semantics that applications accept. This layer plays a crucial role in ensuring that data is presented in a manner suitable for the Application Layer.

7. **Application Layer:**
   At the top of the OSI Model, the Application Layer is closest to end-users and directly interacts with software applications. It provides network services to end-user applications such as web browsers, email clients, and office suites. The Application Layer is responsible for identifying communication partners, checking resource availability, and synchronizing communication. Common examples of Application Layer protocols include HTTP, FTP, SMTP, and many others. This layer also deals with user authentication, authorization, and data exchange.

Additionally, you may sometimes come across the concept of an 8th layer in the OSI model. This layer, while not officially recognized, is often humorously referred to as the 'user layer.' It represents the end-users themselves, and people tend to mention it when discussing issues related to user interactions with the applications and services provided by the topmost layer (Layer 7 - Application Layer). While not a formal part of the OSI model, the 'user layer' serves as a reminder that the success of any network ultimately depends on the people who use it, making it more of a lighthearted addition rather than an official component.

You can remember the layers of the OSI model by using the mnemonic "**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way." Here's an explanation for each word in the mnemonic corresponding to the OSI model layers:

1. **Please (P)**: This stands for the Physical Layer (Layer 1). Think of "Please" as the foundation, just like the physical hardware and transmission media are the foundation of network communication.

2. **Do (D)**: This represents the Data Link Layer (Layer 2). "Do" reminds us of the tasks performed at this layer, such as data framing and link control.

3. **Not (N)**: "Not" is for the Network Layer (Layer 3). This layer deals with network addressing and routing, ensuring that data finds its way to the correct destination.

4. **Throw (T)**: "Throw" corresponds to the Transport Layer (Layer 4). Just as you might throw a package onto a conveyor belt for reliable delivery, this layer is responsible for reliable end-to-end data transfer.

5. **Sausage (S)**: "Sausage" represents the Session Layer (Layer 5). Think of it as the layer where sessions are established, maintained, and terminated during communication.

6. **Pizza (P)**: "Pizza" stands for the Presentation Layer (Layer 6). This layer "presents" data in a format that applications can understand by handling data translation, encryption, and compression.

7. **Away (A)**: Finally, "Away" corresponds to the Application Layer (Layer 7), which is the topmost layer. This layer provides network services directly to user applications.

