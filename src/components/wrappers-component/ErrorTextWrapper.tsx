import React from 'react';
import { useTailwind } from 'tailwind-rn';
import { ResponsiveUi } from '../responsive-ui/responsive-ui';
import { ErrorProps } from 'src/typings/input-typings';
import { getColorValue } from 'src/utils/utils';


const ErrorTextWrapper: React.FC<ErrorProps> = ({ hasError, isValid, errorMessage }) => {
  const tailwind = useTailwind();
  const error = getColorValue('text-error', tailwind)
  return (
    <>
      {hasError && isValid ? (
        <ResponsiveUi.Text regular h7 color={error} style={[tailwind('mb-3'), {}]}>
          {errorMessage}
        </ResponsiveUi.Text>
      ) : null}
    </>
  );
};
export default ErrorTextWrapper;
