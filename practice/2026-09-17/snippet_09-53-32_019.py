# Practice commit 19
# Topic: practiced reading LeetCode problem statements

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
