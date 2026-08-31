# Practice commit 5
# Topic: revised boolean logic: True False and or not

arr, target = [1,3,5,7,9], 7
l, r = 0, len(arr)-1
while l <= r:
    m = (l+r)//2
    if arr[m]==target: print(m); break
    elif arr[m]<target: l=m+1
    else: r=m-1
