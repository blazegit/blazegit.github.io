---
title: Agent Sudo
date: 2022-06-13 17:00:00 +500
categories: [THM, easy machines]
tags: [hash, bruteforce]    # TAG names should always be lowercase
---

![](https://tryhackme-images.s3.amazonaws.com/room-icons/aedc6b66c222e15ff740c282a0c3f44e.png)


## Enumerate

### How many open ports?

As always, let's start with a quick Nmap scan:

```terminal
nmap -p- -sS --min-rate 10000 --open -vvv -n -Pn 10.10.143.70
```

```
PORT   STATE SERVICE REASON
21/tcp open  ftp     syn-ack ttl 60
22/tcp open  ssh     syn-ack ttl 60
80/tcp open  http    syn-ack ttl 60
```

we have the first answer and we know what services the machine is running.

>

### How you redirect yourself to a secret page?

let's go check out the webpage. We have a simple page with a message:

```
Dear agents,

Use your own codename as user-agent to access the site.

From,
Agent R 
```

note how codename is marked in bold, this must be a hint that some username is using an agent code name, like Agent R, I suppose there are other agents with letters.

now I ran a gobuster scan but found nothing, I asked chatGPT to generate me a list with the format agent[letter] with all the alphabet, then the alphabet alone, but nothing. Then checked the cookies, but they were none.

At this point I was stuck, doing a little sneak peek to a writeup I saw that he was trying to change the User-Agent, so it made sense. So I opened up Burpsuite, clicked open browser, and activate intercept mode, and then the reply I send it over to the repeater, so it's easier to change the User-Agent and try each agent. After I tried everyone, nothing new. So I tried just with the letter, and with the letter C I got a new reply, 'Location:xxxxx_x_xxxxxxxxx.xxx'.

with what header field we were able to find the location?:

>

### What is the agent name?

so I headed over: 'http://10.10.143.70/xxxxx_x_xxxxxxxxx.xxx', and I found a note.

```
Attention xxxxx,

Do you still remember our deal? Please tell agent J about the stuff ASAP. Also, change your god damn password, is weak!

From,
Agent R 
```

> 

## Hash cracking and brute-force

### FTP password

Now that we have a username, and Agent R says that his password it's weak, let's try to brute-force it, we'll use Hydra.

```terminal
hydra -l chris -P /usr/share/wordlists/rockyou.txt 10.10.143.70 ftp
```

and we have a valid password!

```
[21][ftp] host: 10.10.143.70   login: chris   password: xxxxxxx
```

>

### Zip file password

login to the FTP with the credentials we got. We found three files:

```
cute-alien.jpg  cutie.png  To_agentJ.txt
```

To_agentJ.txt
```
Dear agent J,

All these alien like photos are fake! Agent R stored the real picture inside your directory. Your login password is somehow stored in the fake picture. It shouldn't be a problem for you.

From,
Agent C
```

This note is a hint that the password for agent J is store in the picture. So let's analyze the pictures with Binwalk that is a popular tool used for analyzing and extracting data embedded within binary files.

```terminal
binwalk cute-alien.jpg
```

```
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
```

nothing in this one.

```terminal
binwalk cutie.png
```

```
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 528 x 528, 8-bit colormap, non-interlaced
869           0x365           Zlib compressed data, best compression
34562         0x8702          Zip archive data, encrypted compressed size: 98, uncompressed size: 86, name: To_agentR.txt
34820         0x8804          End of Zip archive, footer length: 22
```

with the flag '-e' we extract what's inside, I was getting an error that's why I also added the '--run-as=root'.

```terminal
binwalk -e cutie.png --run-as=root
```

we have the following files:

```
365  365.zlib  8702.zip  To_agentR.txt
```

I tried to cat out the txt file, but nothing happened, then I noticed that the file's size was 0. The others file I don't know what they are. So that's the zip we need to get the password from, the zip is with a password, and since the title of the section is brute force, I'll try to crack it with john. To crack a zip password with john the first step is making it readable to john:

```terminal
zip2john 8702.zip > hash
```

then the john command with the rockyou wordlists:

```terminal
*****            (8702.zip/To_agentR.txt) 
```

> 

### steg password


now that we have the password, let's unzip it:

```terminal
7z x -p{password} 8702.zip
```
* you have to write the password without the {}

this extract 'To_agentR.txt'

```
Agent C,

We need to send the picture to 'xxxxxxxx' as soon as possible!

By,
Agent R
```

I don't know what's that, maybe a directory, but seems encrypted, i throw it to cyberchef, and indeed was base64 encoded.

>

### Who is the other agent (in full name)?

now we have a steg password, so I assume now that the other picture has something in it, that we can see using steghide and this password. (Steghide is a tool that allows you to hide secret information within image or audio files).

```terminal
steghide extract -sf cute-alien.jpg -p <steg password>
```

we are left with this file 'message.txt'

```
Hi xxxxx,

Glad you find this message. Your login password is xxxxxxxxxxxx

Don't ask me why the password look cheesy, ask agent R who set this password for you.

Your buddy,
chris
```

this straight out gives us the username for Agent J and his password.

### SSH password

in the note above.

>

## Capture the user flag

### What is the user flag?

Now that we have the Agent J credentials let's login into with SSH. and cat the user flag under Agent J directory.

>

### What is the incident of the photo called?

next to the user flag, we have a picture, I can't view it through SSH, after a quick look for a way to transfer the image to my machine I see that we have python3 so I'll start a simple HTTP server and retrieve the photo from my machine, on the victim's machine:

```terminal
python3 -m http.server
```
now on our machine 'wget <victims IP>:port/file'


this method didn't worked, so I'll try with scp

```terminal
sudo scp xxxxx@10.10.143.70:/home/xxxxx/Alien_autospy.jpg .
```
*this command only worked for me with sudo privileges

I tried binwalk, exiftool(for the metadata), strings, but nothing, then I clicked on the hint. 

```hint
Reverse image and Foxnews.
```

* "Reverse image" refers to the process of using an image as a search query to find similar or related images

my first thought is google images:
Google lens wasn't that effective, after googling what the photo was about and Fox News I found the answer.

>

## Privilege escalation

### (Format: CVE-xxxx-xxxx)

As usual, I start seeing what I can run as sudo: 

```terminal
sudo -l
```

```
(ALL, !root) /bin/bash
```

my first thought after seeing this was Im ready is just 'sudo /bin/bash', but it said we are not allowed.
since the answer was about a CVE I search on Google and I found the exploit on exploit-db and the CVE.

(more on this vulnerability on https://tryhackme.com/room/sudovulnsbypass)

>

### What is the root flag?

head over /root directory and cat the flag.

>

### (Bonus) Who is Agent R?

look closely in the root flag.

>
