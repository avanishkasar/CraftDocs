# Practice commit 22
# Topic: studied binary search: how it halves search space

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
