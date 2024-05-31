
# Music Archive

An app to store all relevant information about music bands. This archive is going to be community driven - users will be able to modify/create information which is going to be reviewed by administrators before committing the new information.

Current version provides crude front-end, so you can freely browse and add data. Adding entries requires authentication.

# Setting Up

### Environmental Variables

Use the provided example env, no extra variables are required.

### Run Locally

In the project directory

Install dependencies

```bash
  npm install
```
Start server with an in-memory database

```bash
  npm run dev:mem -w server
```
Start client in another terminal

```bash
  npm run dev -w client
```

### Running Tests

Run tests

```bash
  npm run test -w server
```
Run coverage

```bash
  npm run coverage -w server
```
