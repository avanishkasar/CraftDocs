# Practice commit 8
# Topic: revised BFS and DFS core differences

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)
