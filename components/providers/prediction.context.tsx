"use client";

import { PropsWithChildren, createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { CompletePred, MatchWithTeams } from "@/app/types";
import { QueryKeys } from "@/lib/constants";

type PreditionContextProps = {
    match: MatchWithTeams;
    pred?: CompletePred;
};

const PredictionContext = createContext<PreditionContextProps>(
    {} as PreditionContextProps
);

export default function PredictionProvider({
    children,
    match,
}: PropsWithChildren & { match: MatchWithTeams }) {
    // const [pred, setPred] = useState<CompletePred | undefined>(undefined);
    const { data } = useQuery({
        queryKey: [QueryKeys.USER_PRED, match.num],
        queryFn: async () =>
            await getUserPredictionForMatch({ num: match.num }),
    });
    const pred = data?.[0]?.status === "placed" ? data[0] : undefined;

    // useEffect(() => {
    //     async function getData() {
    //         const [data, err] = await getUserPredictionForMatch({
    //             num: match.num,
    //         });
    //         if (data && data.status === "placed") setPred(data);
    //         else if (!data) {
    //             const newPredCutoff = getISTDate(match.date, -30);
    //             const currentISTTime = getCurrentISTDate();
    //             if (currentISTTime >= newPredCutoff)
    //                 await addDefaultPredictionForMatch({
    //                     num: match.num,
    //                     minStake: match.minStake,
    //                 });
    //         }
    //     }
    //     getData();
    // }, []);

    return (
        <PredictionContext.Provider value={{ pred, match }}>
            {children}
        </PredictionContext.Provider>
    );
}

export const usePredictionContext = () => {
    const context = useContext(PredictionContext);
    if (!context) throw new Error("Prediction Context not used!");
    return context;
};
