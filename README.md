
# Codeize's Discord Bot Template

![Codeize Banner](https://cdn.discordapp.com/attachments/1081331606775676998/1081331613595619328/PFP_Banner.png)

This is a monorepo template for advanced Discord bots.
> **Note**
> This template requires at least an intermediate understanding of TypeScript, Prisma/MySQL and the Discord API, and you'll need to familiarize yourself with the concepts of a monorepo. You'll find things very hard if you don't follow the above.

## Demo

TODO: Insert gif or link to demo

## Setup

1. Clone the repo

    ```bash
    git clone https://github.com/Codeize/template.git
    ```

2. Install dependencies

    ```bash
    pnpm install
    ```

3. Create and fill in a `.env` file as per the example dataset provided in `.env.example`.

4. Sync the database

    ```bash
    pnpm db:push
    ```

5. Start the bot

```bash
pnpm dev
```

## Used By

Here are some bots that use this template, or a modified version of it:

- [PizzaPlace](https://pizzaplace.lol)
- [Kiai](https://kiaibot.com)

## Roadmap

- [ ] Prometheus & Grafana Support
- [ ] Docker Support
- [ ] Better Documentation
- [ ] Demo Video
- [ ] Admin Panel
- [ ] Dasboard
- [ ] Marketing Website

## Contributing

Contributions are always welcome!

If you have a suggestion or spot a  bug feel free to open an issue and I'll get back to you as soon as I can.

## Acknowledgements

- [Shadow](https://github.com/thewilloftheshadow) for many discussions on how initial the initial template by Polar could be improved, aswell as some code snippets here and there.
- [Polar](https://github.com/xPolar) at [OtterDevelopment](https://github.com/OtterDevelopment) for creating [the initial version of this template](https://github.com/OtterDevelopment/typescript-discord-boilerplate).

## Support

For support, you can start an issue and I'll try help you out there.
