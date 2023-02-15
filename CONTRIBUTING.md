# Welcome to Tunnelmole contributing guide <!-- omit in toc -->

Thank you for investing your time in contributing to Tunnelmole!

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

### Getting Started
The [Readme](./README.md) file has detailed instructions on how to set up the project and start making changes.

This repo includes several things to enahnce your developer experience including hot reload and sample debugging config for Visual Studio Code.

### Good Issue Descriptions
When creating an issue, include clear steps to reproduce in addition to
- Your Operating System
- How you installed Tunnelmole. Are you using the precompiled binary or the latest source version from GitHub?
- What did you expect to happen and what actually happened?

### Coding standards

#### Functional Programming
Tunnelmole uses functional programming. So its better to use functions, not classes.

#### Single Responsibility Principle. 
Functions should do one thing. If they do more than one thing, they should be split into separate functions.

#### Return early with Guard Clauses
Functions should return as early as possible. For example, instead of
```
function strtoupper(str: string|null) : String|null {
	if (str !== null) 
	{
		// Transform the string
	} else {
		return str.toUpperCase();
	}
}
```

You could do this
```
function transformString(str: string|null) : String|null {
	// Guard clause to check that the argument is not null
	if (str !== null) 
	{
		return null;		
	}

	// Add as many guard clauses as needed

	return str.toUpperCase();
}
```

#### Perfer async/await over callbacks
Callbacks can get messy, so wherever possible use async/await instead.

#### ES6 Modules
Wherever possible, use ES6 modules over commonjs ones, even if sometimes commonjs modules are unavoidable.


