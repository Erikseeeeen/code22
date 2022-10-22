import socket
s = socket(AF_INET, SOCK_STREAM)
s.connect(("192.168.1.177", 80))
s.send(b"GET / HTTP/1.1\r\n")
while True:
    data = s.recv(4096).decode("utf-8")
    for i in data.split("\r\n"):
        if i:
            print(i)