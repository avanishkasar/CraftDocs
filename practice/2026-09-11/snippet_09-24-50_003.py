# Practice commit 3
# Topic: revised integer division // vs true division /

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
