# Drafting Page Design and Implementation Developer Documentation
- This is everything that has to deal with the [Drafts Page](/pages/drafts/index.js).
- This design document will also tie in the development of the [Posts Page](/pages/posts/index.js).

### Abstraction
- This features is absolutely crucial to the Blog Web Application.
- On the admin/blog-writer's end, this is where they will write their posts.
- It will stay as draft after the writer finishes writing their post.
- Drafts are drafts, and they will not be visible to the public's view on the [Posts Page](/pages/posts/index.js)

### Saving the Drafts
- First off, what about version control? That might be something to consider down the road. But right now, the simplest option would be just to handle version control in another software. I'm going to use a full-featured markdown editor, and then paste the markdown in the Drafts page. Just keep it simple, and first get my blog working. Any further on this topic will delay the release of the blog.
- With that say, this blog app is using Prisma with PostgreSQL hosted on a google cloud platform. The Prisma database connection stuff is already sorted; so, we do not have to worry about that.
- To make things easier, development should start with the front-end (obviously).

### Libraries
- This page definitely needs a markdown parser: markdown-it.

### Front-End
- Things should be pretty simple. There should be two divs. One of them is the html text input. The other one would be the displayed html via markdown (using markdown-it library).

### Back-End
- In the Prisma Schema, the markdown content is going to be stored as a string. Or actually as I have too look into it more: a TEXT field.
- Yes, just store the markdown into as a TEXT field.
- Also, I am going to store the HTMl as well just for fast-serving in stead of converting it.
- So perhaps, I will convert the markdown to HTML when saved (or published which that procedure should be made to save as well). When published, the HTML will be stored in the database (after passing it through a markdown parser [markdown-it]). Then, when I am serving the posts through querying the html.
- Storing the HTML will allow faster serving of posts. This will be done again, after publishing.
- The Model of the Database that is used should only be the Post model.

- Also, when a draft is written, it is absolute that the title must be provided as how the model requires a title.
- A personal note is that I need to spend some time reading the Prisma documentation. I am probably going read it tomorrow before finally actually coding on Thursday. Also, I have no idea how to write to the database.

- Some methods that I have found through reading [documentation-CRUD: Create, Read, Update, Delete](https://www.prisma.io/docs/concepts/components/prisma-client/crud):
1. upsert()
2. create()
3. findMany()
