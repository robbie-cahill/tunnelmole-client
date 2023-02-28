# Welcome to Tunnelmole contributing guide <!-- omit in toc -->

Thank you for investing your time in contributing to Tunnelmole!

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

### Getting Started
The [Readme](./README.md) file has detailed instructions on how to set up the project and start making changes.

This repo includes several things to enahnce your developer experience including hot reload and sample debugging config for Visual Studio Code.

### Ways to Contribute
Here are some different ways you can help
- Help with testing Tunnelmole. Install the latest binary or build the latest source release and do your best to break it. If you're able to, create an issue.
- Creating documentation, cookbooks and guides. Just submit it to this repo under the `docs` folder in Markdown format (the folder is currently non-existant, so you can be the first to create it)
- Spreading the word. As previously mentioned, there is no big company or marketing department. That leaves it up to you to help others by introducing them to Tunnelmole. Sharing Tunnelmole on social media sites and creating blog articles will help you look good and help other developers.
- Fixing bugs
- Making feature requests. To do this, create a GitHub issue and describe the feature you think Tunnelmole should have. We won't implement everything, but features people are interested in will be noted down. Of course, a good way to speed up the implementation of a feature is to implement it yourself and send in a pull request!
- Implementing feature requests others have made and sending in pull requests

For any code changes, you will need to fork this repo and submit a PR. If you've never done this before, GitHub has a very good guide [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

### Good Issue Descriptions
When creating an issue, include clear steps to reproduce in addition to
- Your Operating System
- How you installed Tunnelmole. Are you using the precompiled binary or the latest source version from GitHub?
- What did you expect to happen and what actually happened?

### Good feature requests
When creating a feature request, include the following
- How you would use the feature, if it was implemented
- A clear description of what the feature is and how it would work
- If you know of any good categories of users that might use this feature, mention them in the request

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
