---
title: "Project Showcase: IoT Hydroponics - Automating Lettuce Cultivation with ESP32"
date: 2025-11-28 12:00:00 -0300
categories: [projects, iot]
tags: [esp32, hydroponics, automation, cpp, arduino]
---

This project was a quick, 2-day DIY build born out of necessity and curiosity. I wanted to merge sustainable agriculture with technology, creating a self-regulating hydroponic system for growing lettuce. The catch? I had to use whatever materials I had on hand.

### The Problem: The Heat Trap
The physical structure is a simple table-top greenhouse. I built the frame from wood and used flexible orange electrical conduit pipes to create hoops for the plastic cover. The reservoir is a "Deep Water Culture" (DWC) style setup, lined with a heavy-duty blue tarp.

It worked well, but too well. During the day, the internal temperature would skyrocket, turning the greenhouse into an oven. The plastic cover needed to be removed every morning to release heat, but put back every night to protect the plants from the cold. I needed a system that could manage this airflow automatically.

### The Solution: Automated "Lung" Ventilation
Since I couldn't be there to open the "door" all the time, I decided to automate it. I built a custom ventilation system using PVC pipes.

The mechanism is simple but effective: I attached servo motors to metal plates acting as valves within the PVC tubes. These servos physically rotate the plates to open or close the airflow. To ensure active air exchange, I paired these vents with relay-controlled DC fans. It’s essentially a breathing system for the greenhouse—inhaling cool air and exhaling hot air when needed.

### The "Brain": ESP32 & Code Summary
The entire operation is controlled by an ESP32 microcontroller. I wrote the firmware in C++ using the Arduino framework.

**Executive Summary of the Logic:**
The code implements a state machine that constantly monitors a DHT22 sensor.
*   **Hysteresis Control:** To prevent the motors from burning out due to rapid toggling, I implemented a hysteresis loop. The cooling cycle triggers only when the temperature exceeds **26°C** and stays active until it drops below **25°C**.
*   **Resilience:** Data is logged locally to the ESP32's internal **SPIFFS** storage (`/log.csv`) every hour. This ensures that even if Wi-Fi connectivity drops, the environmental history is preserved.
*   **Remote Alerts:** I integrated the **PushingBox API** to send me email notifications every 15 minutes. This keeps me informed of the greenhouse's vitals without needing to constantly check the dashboard.
*   **The Sequence:** When cooling is needed, the system gracefully opens the servo-controlled vents first, waits for 5 seconds, and then kicks on the fans.
*   **Interface:** It hosts a standalone web server with a custom dashboard, allowing me to see real-time data and manually override the controls if necessary.

![Dashboard View](/assets/greenhouse/image.png)
*The custom web dashboard*

### Gallery
Here are some shots of the build process, showing the wiring, the structure, and the components.

![Greenhouse Overview](/assets/greenhouse/WhatsApp%20Image%202025-11-27%20at%2017.14.40.jpeg)
![Structure Construction](/assets/greenhouse/1751840048550.jpg)
![Electronics Setup](/assets/greenhouse/1751840048559.jpg)
![Prototype Wiring](/assets/greenhouse/1751840048554.jpg)
![Dashboard Photo](/assets/greenhouse/1751840048564.jpg)
