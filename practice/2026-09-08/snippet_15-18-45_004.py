# Practice commit 4
# Topic: revised integer division // vs true division /

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
