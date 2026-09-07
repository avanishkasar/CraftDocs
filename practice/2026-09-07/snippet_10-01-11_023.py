# Practice commit 23
# Topic: practiced reading LeetCode problem statements

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
