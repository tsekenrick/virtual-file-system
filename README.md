# Virtual File System
For this assignment, we were asked to create an Express web application to simulate the basic functionality of a file system that would be found on a Linux shell (e.g. `ls`, `mkdir`, `tree`, etc). The program first parses a json object that represents the initial state of the file system, and then allows users to write commands to the "shell" via form submission, and displays the results.

## Links

* the part of your code that instantiates the `FileSystem` class with an object (from parsed JSON) being used to bootstrap it with some initial virtual file system data
	* [Line 31, app.js](https://github.com/tsekenrick/virtual-file-system/blob/ae94e4fbb2625c7e9466761a1a6c337609918112/app.js#L31)
* one example of using the instance of `FileSystem` to provide the data needed to fulfill a request... 
	* __example__: if there's a `POST` to `vfs` with `ls` as the form input
		* [Calling `find` and `treeFind` on the FileSystem to fulfill `GET` request to `vfs` with `tree` command](https://github.com/tsekenrick/virtual-file-system/blob/ae94e4fbb2625c7e9466761a1a6c337609918112/app.js#L71-L80)
	* show the part of your code where a method is called on your instance of `FileSystem` 
		* [Here are the called methods, `find` and `treeFind`, as defined in the `FileSystem` class](https://github.com/tsekenrick/virtual-file-system/blob/ae94e4fbb2625c7e9466761a1a6c337609918112/vfs/FileSystem.js#L9-L52)
	* ...that gives back a list of files that are eventually put into a rendered template
		* The result of the method calls is processed into a string with html formatting (as seen in the code linked above)
		* [The reference to the processed string is passed into the object parameter in `res.render`](https://github.com/tsekenrick/virtual-file-system/blob/ae94e4fbb2625c7e9466761a1a6c337609918112/app.js#L83)
			* [...which is then rendered in the `terminal.hbs` template](https://github.com/tsekenrick/virtual-file-system/blob/ae94e4fbb2625c7e9466761a1a6c337609918112/views/terminal.hbs#L36)
