import {
    getMaxLostAmount,
    getMaxWonAmount,
    getPredictionAccuracy,
} from "@/actions/prediction.actions";
import { getCurrUser } from "@/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export default async function StatsSlider() {
    const [user] = await getCurrUser();
    const [maxWonAmt] = await getMaxWonAmount({ userId: user?.userId! });
    const [maxLostAmt] = await getMaxLostAmount({ userId: user?.userId! });
    const [data] = await getPredictionAccuracy({ userId: user?.userId! });

    return (
        <InfiniteSlider speedOnHover={20} gap={24}>
            {!!data && (
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-extralight uppercase">
                            Prediction Accuracy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2 text-2xl">
                        {data.correct}/{data.total}
                        {data.total > 0 && (
                            <span className="text-base text-muted-foreground">
                                ({Math.floor((data.correct / data.total) * 100)}
                                %)
                            </span>
                        )}
                    </CardContent>
                </Card>
            )}

            {!!maxWonAmt && (
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-extralight uppercase">
                            Biggest Win
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl text-success">
                        {maxWonAmt?.toFixed()}
                    </CardContent>
                </Card>
            )}

            {!!maxLostAmt && (
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-extralight uppercase">
                            Biggest Loss
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl text-destructive">
                        {maxLostAmt?.toFixed()}
                    </CardContent>
                </Card>
            )}
        </InfiniteSlider>
    );
}
