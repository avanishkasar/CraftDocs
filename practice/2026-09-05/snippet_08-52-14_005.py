# Practice commit 5
# Topic: practiced breaking problems into smaller steps

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
