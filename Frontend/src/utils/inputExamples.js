// Input/stdin examples for different languages
export const INPUT_EXAMPLES = {
  python: {
    title: "Python - Read Input",
    code: `# Method 1: Read single line
name = input()
print(f"Hello, {name}!")

# Method 2: Read multiple lines
lines = []
import sys
for line in sys.stdin:
    lines.append(line.strip())
print(f"You entered: {lines}")`,
    preview: "Input: Alice\nOutput: Hello, Alice!"
  },
  javascript: {
    title: "JavaScript - Read Input",
    code: `// Read input line by line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  console.log(\`Hello, \${input}!\`);
  rl.close();
});`,
    preview: "Input: Bob\nOutput: Hello, Bob!"
  },
  java: {
    title: "Java - Read Input",
    code: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String name = sc.nextLine();
    System.out.println("Hello, " + name + "!");
    sc.close();
  }
}`,
    preview: "Input: Charlie\nOutput: Hello, Charlie!"
  },
  cpp: {
    title: "C++ - Read Input",
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
  string name;
  getline(cin, name);
  cout << "Hello, " << name << "!" << endl;
  return 0;
}`,
    preview: "Input: David\nOutput: Hello, David!"
  },
  c: {
    title: "C - Read Input",
    code: `#include <stdio.h>
#include <string.h>

int main() {
  char name[100];
  fgets(name, sizeof(name), stdin);
  // Remove newline if present
  name[strcspn(name, "\\n")] = 0;
  printf("Hello, %s!\\n", name);
  return 0;
}`,
    preview: "Input: Eve\nOutput: Hello, Eve!"
  },
  go: {
    title: "Go - Read Input",
    code: `package main

import (
  "fmt"
  "bufio"
  "os"
)

func main() {
  scanner := bufio.NewScanner(os.Stdin)
  scanner.Scan()
  name := scanner.Text()
  fmt.Printf("Hello, %s!\\n", name)
}`,
    preview: "Input: Frank\nOutput: Hello, Frank!"
  },
  rust: {
    title: "Rust - Read Input",
    code: `use std::io::{self, BufRead};

fn main() {
  let stdin = io::stdin();
  let mut line = String::new();
  stdin.lock().read_line(&mut line).unwrap();
  let name = line.trim();
  println!("Hello, {}!", name);
}`,
    preview: "Input: Grace\nOutput: Hello, Grace!"
  },
  ruby: {
    title: "Ruby - Read Input",
    code: `# Read single line
name = gets.chomp
puts "Hello, #{name}!"

# Read multiple lines
lines = STDIN.readlines
puts "You entered: #{lines.inspect}"`,
    preview: "Input: Henry\nOutput: Hello, Henry!"
  },
  bash: {
    title: "Bash - Read Input",
    code: `#!/bin/bash

# Read single line
read name
echo "Hello, $name!"

# Read multiple lines
while IFS= read -r line; do
  echo "You entered: $line"
done`,
    preview: "Input: Ivy\nOutput: Hello, Ivy!"
  },
  ts: {
    title: "TypeScript - Read Input",
    code: `import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input: string) => {
  console.log(\`Hello, \${input}!\`);
  rl.close();
});`,
    preview: "Input: Jack\nOutput: Hello, Jack!"
  },
  swift: {
    title: "Swift - Read Input",
    code: `import Foundation

if let name = readLine() {
  print("Hello, \\(name)!")
}`,
    preview: "Input: Kate\nOutput: Hello, Kate!"
  },
  kotlin: {
    title: "Kotlin - Read Input",
    code: `fun main() {
  val name = readLine()!!
  println("Hello, $name!")
}`,
    preview: "Input: Leo\nOutput: Hello, Leo!"
  },
  csharp: {
    title: "C# - Read Input",
    code: `using System;

class Program {
  static void Main() {
    string name = Console.ReadLine();
    Console.WriteLine(\$"Hello, {name}!");
  }
}`,
    preview: "Input: Mike\nOutput: Hello, Mike!"
  },
  perl: {
    title: "Perl - Read Input",
    code: `#!/usr/bin/perl
my $name = <STDIN>;
chomp($name);
print "Hello, $name!\\n";`,
    preview: "Input: Nancy\nOutput: Hello, Nancy!"
  },
  julia: {
    title: "Julia - Read Input",
    code: `# Read from stdin
line = readline()
println("Hello, $line!")`,
    preview: "Input: Oscar\nOutput: Hello, Oscar!"
  },
  sql: {
    title: "SQL - Note",
    code: `-- SQL doesn't read stdin interactively.
-- Use direct SQL queries instead.
SELECT 'Hello, World!' as greeting;`,
    preview: "Output: Hello, World!"
  }
};

export default INPUT_EXAMPLES;
