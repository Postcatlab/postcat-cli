# EO CLI

## Installion

```
npm install -g @eoapi/cli
```

Now, you can use `eo xxx` command to generate、upload plugin of eoapi.

## Generate

```
eo generate <plugin name>
# or
eo g <plugin name>
```

The commad will generate a folder includes base config files, let you could create any features.

## Upload

```
eo upload <plugin package>
```

It will find and go inside the package directory, and upload the `package.json` to eopai market. However you need to wait until it is approved to find it in the market.
