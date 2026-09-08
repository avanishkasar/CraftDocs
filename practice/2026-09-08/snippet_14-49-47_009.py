# Practice commit 9
# Topic: went over list vs set: when to use which

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
