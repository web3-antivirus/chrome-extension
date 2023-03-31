import useSWR from 'swr';
import { URL_ANALYZE_API } from 'constants/check-nft.constants';
import { get } from 'helpers/axios.helper';
import { prepareUrl } from 'helpers/url.helpers';
import { useCurrentUrl } from 'hooks/use-current-url';
import { AnalysisDescriptorDTO } from 'dtos/url-analyze.dto';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { useMemo } from 'react';
import { SITE_ANALYSIS_INFO } from 'modules/analyze/Scan/constants';

const useUrlAnalyze = (): AnalysisDescriptorDTO | undefined => {
  const url = useCurrentUrl();

  const key = url ? prepareUrl(URL_ANALYZE_API, { url }) : null;
  const { data } = useSWR<AnalysisDescriptorDTO>(key, get);

  return data;
};

export default useUrlAnalyze;

export const useUrlAnalyzeAlert = (): IHighlightAlert | null => {
  const urlAnalyze = useUrlAnalyze();

  const urlAlert: IHighlightAlert | null = useMemo(() => {
    if (urlAnalyze) {

      const { risk, text } = SITE_ANALYSIS_INFO[urlAnalyze.status];
      return ({
        website: {
          name: window.location.hostname,
          text,
        },
        risk,
      });
    }

    return null;
  }, [urlAnalyze]);

  return urlAlert;
};
