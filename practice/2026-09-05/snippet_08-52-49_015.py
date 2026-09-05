# Practice commit 15
# Topic: practiced stack-based problem solving

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
