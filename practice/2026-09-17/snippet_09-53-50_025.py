# Practice commit 25
# Topic: revised BFS and DFS core differences

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)
