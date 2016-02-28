# [Hack Oregon](http://www.hackoregon.org/) - Urban Development project
# Getting started as a contributor

The purpose of this document is to help you get started as a contributor for [Hack Oregon](http://www.hackoregon.org/)'s Urban Development project. "Contributor" often means one who writes code, but technical writers and business analysts may also be contributing documents, so "contributor" is more general, and more appropriate in this case, than "software developer" or "programmer". Team membership is always in a state of flux with people coming and going, each with their own unique history of development experience. We hope this documentation will provide consistency over time as team membership changes. Another benefit for those of you with little development experience is that this process is widely used by other developers on open source projects and on commercial software projects. We did not make this up ourselves, so developing with the Urban Development team will prepare you to work on other teams in the future.

## Process description

Follow the links to articles that describe each step in detail.

1. Sign up for a [GitHub](https://github.com/) account.

2. [Fork](https://help.github.com/articles/fork-a-repo/) a Hack Oregon _project repository_ into your _personal GitHub repository_.

3. Clone your _personal GitHub repository_ to your local development machine. We call that cloned repository your _local repository_. See the explanation in the GitHub Guide ["Fork a repo"](https://help.github.com/articles/fork-a-repo/).

4. Configure your _local repository_ to reference the Hack Oregon _project repository_ as your 'upstream' remote repository. See the explanation in the GitHub Guide ["Fork a repo"](https://help.github.com/articles/fork-a-repo/).

5. Starting from the 'develop' branch in your _local repository_, create a new branch when you are ready to make changes to existing files or create new material. Name that new branch something descriptive for the feature you are adding, e.g. "

6. Commit your changes on that branch as often as necessary until you have completed your unit of work.

7. [Synchronize your _local repository_](https://help.github.com/articles/syncing-a-fork/) with the Hack Oregon (upstream) repository. Other development may have been committed to the _project repository_ while you have been working on your branch, so you will want to merge from the _project repository_ master to your branch, in order to keep in-sync.

8. Push the branch from your _local repository_ to your _personal GitHub repository_.

9. [Create a pull request](https://help.github.com/articles/using-pull-requests/) from the branch in your _personal GitHub repository_ to the 'develop' branch in the _project repository_.

10. Someone in the project with "committer" privileges will review your pull request. They may merge it as-is or they may suggest changes to you. If necessary, return to step 6 to keep improving your contribution and update your pull request.

## Glossary

A _repository_ holds code as it is developed. There are three interconnected repositories as you contribute to the Urban Development project.

* _local repository_ is the term we use in this documentation as the git repository on your local, personal development machine. It is cloned from your _personal GitHub repository_.

* _personal GitHub repository_ is the repository associated with your GitHub account. It is cloned from the _project repository_.

* _project repository_ is the repository in Hack Oregon's GitHub account which holds the history of all work that has been done. Code from this repository is deployed to the different deployment environments, such as testing, staging, and production.
  * Urban Development [front end](https://github.com/hackoregon/urbandev-frontend) repository
  * Urban Development [back end](https://github.com/hackoregon/urbandev-backend) repository

## References

### GitFlow references
GitHub help. [Fork A Repo](https://help.github.com/articles/fork-a-repo/). Accessed 2016-02-27.

GitHub help. [Syncing a fork](https://help.github.com/articles/syncing-a-fork/). Accessed 2016-02-27.

GitHub help. [Using pull requests](https://help.github.com/articles/using-pull-requests/). Accessed 2016-02-27.

GitHub Guides. [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/). Accessed 2016-02-27.<br>"This guide explains how and why GitHub Flow works."

Vincent Driessen. 2010. [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/). Accessed 2016-02-27.<br>This is the original blog post that introduced the GitFlow model.

### Other references for using [git](https://git-scm.com/)

GitHub Guides. [Mastering Markdown](https://guides.github.com/features/mastering-markdown/). Accessed 2016-02-27.<br>The document that you are reading is formatted with Markdown syntax. So if you are going to edit this document, you should learn to use Markdown.

[Git Reference Manual](https://git-scm.com/docs). Accessed 2016-02-27.

Scott Chacon and Ben Straub. 2014. [Pro Git](https://git-scm.com/book/en/v2), 2nd edition. Accessed 2016-02-27.

[How to undo (almost) anything with Git](https://github.com/blog/2019-how-to-undo-almost-anything-with-git)
