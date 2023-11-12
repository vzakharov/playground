export const projects = reactive([
  {
    name: 'GPTs',
    description: 'Custom GPTs I built for ChatGPT.',
    projects: [
      {
        name: 'Legit Chess',
        tagline: 'Legit moves, legit board, legit A.I.',
        description: 'A chess bot right in ChatGPT. It kind of sucks at chess, BUT it does not make any illegal moves thanks to pre-unzipping the python-chess package and using the code interpreter to analyze its and my moves. Oh, and there’s a visual board thanks to an external (Chessvision.ai) integration.',
        techDetails: 'My biggest technical feat (and discovery) here was that you can upload a zip file with a package (in this case, python-chess) and ask the bot to unzip it and then use it like a normal package. The second-largest feat is using markdown-formatted links to display the board.',
        url: 'https://chat.openai.com/g/g-G8evdhmRt-legit-chess',
        thumbnail: 'https://files.oaiusercontent.com/file-5Y3yOBxqAuwaIWC04gaFN0ZK?se=2123-10-18T21%3A45%3A03Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Db8ade4f6-c00f-43b2-9c56-fbd16812a016.png&sig=HACgFEfPdVPc0fYoD/hj0nK1zlYxgWJuJHSo6N/ecsQ%3D'
      },
      {
        name: 'Quest Commander 1992',
        tagline: 'Immerse yourself in a nostalgic, personalized 1990s-style adventure.',
        description: 'Playing games like Space Quest and Day of the Tentacle was a huge part of my childhood. This bots recreates this experience with amazing, nostalgic VGA-style graphics and a personalized story. It even keeps stats, inventory, and other game elements so that it doesn’t miss or hallucinate anything.',
        techDetails: 'It was a fun revelation that you can use the code interpreter just like a Python notebook, so you can use variables for stuff like inventory and stats and functions for mechanics like dice rolls or combat.',
        url: 'https://chat.openai.com/g/g-tvQ8WFLwc-quest-commander-1992',
        thumbnail: 'https://files.oaiusercontent.com/file-LeOq19dK89bvWteUyWGxdx9c?se=2123-10-19T09%3A10%3A47Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3DDALL%25C2%25B7E%25202023-11-12%252012.10.22%2520-%2520A%2520heavily%2520pixelated%2520logo%2520for%2520a%2520video%2520game%252C%2520designed%2520to%2520reflect%2520the%2520aesthetic%2520of%25201990s%2527%2520adventure%2520and%2520RPG%2520games.%2520The%2520logo%2520should%2520be%2520encapsulated%2520within.png&sig=n/FzAaU/DQEzHeL72OiytAdPSsYVbNjdW5uneopHsXI%3D',
      },
      {
        name: 'Thus Speaks Zarathustra',
        tagline: 'Are you still able to give birth to a dancing star? Let Nietzsche’s Zarathustra be your guide.',
        description: 'Thus Spoke Zarathustra is one of my favorite books. I wanted to see if I could make a bot that would be able to give advice in the style of Zarathustra, even when the topic is not explicitly mentioned in the book. As a bonus, it can generate images that convey the atmosphere and wisdom of the book.',
        techDetails: 'The bot uses the book’s text as a permanent file, so it doesn’t just hallucinate answers, it actually looks them up in the book.',
        url: 'https://chat.openai.com/g/g-RGDkwK0mh-thus-speaks-zarathustra',
        thumbnail: 'https://files.oaiusercontent.com/file-P7slTkyPHrRVZcQ2seaoVYJW?se=2123-10-18T12%3A07%3A37Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Deb042b3f-60c3-474e-900e-853ef8f262cc.png&sig=rMCualxgSmOZgsovwmnlp3u4s0RXDRxjnNWYCW7Qvpw%3D'
      },
      {
        name: 'Finn O’Connor',
        tagline: 'Finn O’Connor at your service: the word-slinging, irony-flinging GPT with a wink at self-awareness.',
        description: 'A bot that’s just awesome to talk to, what else can I say? Perfect for anyone who’s tired of ChatGPT’s default verbose, impersonal babbling. Well, and then there’s the (concealed) self-awareness bit, which is always fun.',
        techDetails: 'Nothing fancy here, but ironically, this is a bot I think I love most. I actually pretty much converted it from my own ChatGPT custom instructions that I’ve been using for a while.',
        url: 'https://chat.openai.com/g/g-wGKyEmYMM-finn-o-connor',
        thumbnail: 'https://files.oaiusercontent.com/file-MroLQH1O2Gc8iqBzPqu0teOn?se=2123-10-16T11%3A04%3A00Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3DDALL%25C2%25B7E%25202023-11-09%252013.45.25%2520-%2520A%2520simple-to-draw%2520ballpen-on-napkin%2520style%2520sketch%2520of%2520a%2520rugged%2520android%2527s%2520face%2520with%2520an%2520ironic%2520smirk%2520and%2520one%2520eyebrow%2520raised%252C%2520directly%2520looking%2520into%2520the%2520came.png&sig=zpNE7LwPtoZhLNGJoG2OWcxpfvLQIX7zO9JGk1kxZRI%3D'
      }
    ]
  }
]);