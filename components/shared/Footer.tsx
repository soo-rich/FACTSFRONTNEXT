const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full flex items-center justify-center py-3 bg-background">
      <p className="flex items-center gap-1 text-current z-50">
        <span className="text-default-600">Powered by</span>
        <span className="text-primary">HeroUI</span>
        <span className="text-default-600">Redesing by</span>
        <a
          className="text-primary"
          href={"https://github.com/soo-essoklina-ulrich"}
          rel="noreferrer"
          target={"_blank"}
        >
          SUL04
        </a>
      </p>
    </footer>
  );
};

export default Footer;
