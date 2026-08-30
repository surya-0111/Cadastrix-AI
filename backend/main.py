# Simple Python Program: Age & Birth Year Calculator

# 1. Ask for the user's name
name = input("What is your name? ")

# 2. Ask for their age and convert the input string to an integer
age = int(input(f"Hello, {name}! How old are you? "))

# 3. Calculate the birth year (assuming 2026)
current_year = 2026
birth_year = current_year - age

# 4. Display the result
print(f"Awesome! You were likely born in {birth_year}.")