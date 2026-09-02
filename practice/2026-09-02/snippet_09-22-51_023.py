# Practice commit 23
# Topic: practiced sorted() on strings and lists

stk = []
for ch in '({[]})':
    if ch in '({[': stk.append(ch)
    else: stk.pop() if stk else None
print(not stk)
