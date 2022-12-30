# PC CLI

## Installion

```
npm install -g @postcat/cli
```

Now, you can use `pcex xxx` command to generate、upload plugin of postcat.

## Generate

```bash
pcex generate <plugin name>
# or
pcex g <plugin name>
# or
pcex g <plugin name> [--type] <feature-push | feature-export>
```

The commad will generate a folder includes base config files, let you could create any features.

## Upload

```
pcex upload <plugin package>
```

It will find and go inside the package directory, and upload the `package.json` to postcat market. However you need to wait until it is approved to find it in the market.

## Debug

```
pcex debug <plugin package>
```

The command will create a link between postcat with your extension. It seems like install your extension from the market, but you don't need to upload the extension. We are also planning to support hot-update.

# Cli Development

```
pnpm link --global
```

or

```
npm pack
npm i --location=global postcat-cli-${version}.tgz
```
