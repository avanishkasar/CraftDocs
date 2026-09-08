# Practice commit 7
# Topic: went over prime number checking logic

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
