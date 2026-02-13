#!/bin/bash

# Bash basic template
echo "Hello, World!"
echo "Welcome to Online IDE"

# Simulate a "greet" method
greet() {
    local person_name="$1"
    echo "Hello, $person_name!"
}

# Call greet
greet "${person1[name]}"
greet "${person2[name]}"

# Exit
echo "Exiting the script."
exit 0
