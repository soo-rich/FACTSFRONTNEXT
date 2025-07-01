class UtiliMetod {
  static formatDevise = (value: number, format?: string) => {
    return new Intl.NumberFormat(format ?? 'fr-FR').format(value);
  };
}

export default UtiliMetod;