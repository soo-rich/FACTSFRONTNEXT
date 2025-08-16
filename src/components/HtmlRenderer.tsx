import DomPurify from 'dompurify';

type Props = {
  content: string;
};

export default function HtmlRenderer({ content }: Props) {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DomPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });


return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
