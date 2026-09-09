# Practice commit 6
# Topic: reviewed two-pointer technique basics

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
