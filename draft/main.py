import socket
from socket import AF_INET, SOCK_STREAM
s = socket.socket(AF_INET, SOCK_STREAM)
s.connect(("192.168.1.177", 80))
s.send(b"GET / HTTP/1.1\r\n")
read = True
while read:
    data = s.recv(4096*8).decode("utf-8")
    for i in data.split("\r\n"):
        if i:
            data+=i
            print(i)
            if(i=="DONE"):
                read = False
print(data)