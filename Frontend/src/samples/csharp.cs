using System;

class MainProgram
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        Console.WriteLine("Welcome to Online IDE");

        double a = 10;
        double b = 2;

        double result = Add(a, b);

        Console.WriteLine("The result is: " + result);
    }

    static double Add(double a, double b)
    {
        return a + b;
    }

    static double Subtract(double a, double b)
    {
        return a - b;
    }

    static double Multiply(double a, double b)
    {
        return a * b;
    }

    static double Divide(double a, double b)
    {
        return a / b;
    }
}
