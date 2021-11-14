# GIT

```sh
# Branch
$ git br -a                    # Lists both remote-tracking branches and local branches
$ git br -d branchName         # Deletes a branch
$ git br -D branchName         # --delete --force
$ git br -f branchName         # Resets <branchname> to <startpoint>
$ git ps -d origin branchName  # Deletes a remote branch

# Fetch
$ git fetch --all    # Fetch all remotes
$ git fetch --prune  # After fetching, remove any remote tracking branches which no longer exist on the remote

# Clone
$ git clone -b develop repository-url.git

# Unstage changes
$ git reset HEAD . | fileName1 fileName2

# restore a previous commit's state:
$ git reset --hard a0e4812dbc
$ git ps origin develop --force
```

```sh
$ git remote get-url origin
$ git remote set-url origin https://github.com/USERNAME/REPOSITORY.git

$ git remote set-url origin http://...
$ git remote remove origin
$ git remote add origin http://...

$ git config credential.helper store
$ git config --global credential.helper cache
$ git push http://example.com/repo.git
  # Username: <type your username>
  # Password: <type your password>
#
#
# fatal: Authentication failed for 'https://github.com/aytekinyaliz/repo-name.git/'
# https://medium.com/@ginnyfahs/github-error-authentication-failed-from-command-line-3a545bfd0ca8
# GitHub Developer Settings -> Personel access tokens -> Generate new token
$ git clone https://private_repo.git
  # username: aytekinyaliz
  # password: <generated_token>
```
