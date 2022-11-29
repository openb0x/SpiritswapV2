import { Flex, Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { QuestionIcon } from 'app/assets/icons';

export default function ImageLogo({
  symbol,
  size = '50px',
  margin = '0 4px 0 0',
  type,
  nextPair = false,
  src,
  cw,
  display,
  va,
  m,
}: {
  symbol: string | undefined;
  type?: string;
  size?: string;
  margin?: string;
  nextPair?: boolean;
  src?: string;
  cw?: string;
  display?: string;
  va?: string;
  m?: string;
}) {
  let upperCaseSymbol = symbol?.toUpperCase();
  const srcs: string = useMemo(() => {
    if (type === 'network') return `/images/networks/${symbol}.png`;
    if (type === 'languages') return `/images/languages/${upperCaseSymbol}.png`;

    return `/images/tokens/${upperCaseSymbol}.png`;
  }, [upperCaseSymbol, symbol, type]);

  return (
    <Flex w={cw} display={display} verticalAlign={va} margin={m}>
      {srcs ? (
        <Image
          w={size}
          h={size}
          position={nextPair ? 'relative' : '-moz-initial'}
          right="4"
          margin={margin}
          src={src ?? srcs}
          alt={`${upperCaseSymbol ?? 'token'} logo`}
          fallbackSrc="/images/tokens/default.png"
          fallbackStrategy="onError"
        />
      ) : (
        <QuestionIcon w={size} h={size} />
      )}
    </Flex>
  );
}
