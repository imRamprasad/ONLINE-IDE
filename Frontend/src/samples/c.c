#include <stdio.h>

// Function declaration
int add(int a, int b);

int main() {
    printf("Hello, World!\n");
    printf("Welcome to Online IDE\n");
    add(10, 2);
    return 0;
}

// Function definition
int add(int a, int b) {
    printf("%d\n", a + b);
    return 0;
}
