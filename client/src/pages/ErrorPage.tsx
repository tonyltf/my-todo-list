import { Button, Result } from 'antd';

interface ErrorPageProps {
    error: Error;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    error,
}: ErrorPageProps) => {
    // TODO: Log error, e.g. Sentry
    console.error(error);
    return (
        <Result
            status="500" // TODO: define error type and set status accordingly
            title="Error"
            subTitle="Sorry, something went wrong."
            extra={
                <>
                    <>{error?.message ?? 'Unknown error'}</>
                    <Button type="primary">Back Home</Button>
                </>
            }
        />
    );
};
