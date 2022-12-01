import useSWR from 'swr';
import { URL_ANALYZE_API } from 'constants/check-nft.constants';
import { get } from 'helpers/axios.helper';
import { prepareUrl } from 'helpers/url.helpers';
import { useCurrentUrl } from 'hooks/use-current-url';
import { AnalysisDescriptorDTO } from 'dtos/url-analyze.dto';

const apiUrlAnalyze = (): AnalysisDescriptorDTO | undefined => {
  const url = useCurrentUrl();

  const key = url ? prepareUrl(URL_ANALYZE_API, { url }) : null;
  const { data } = useSWR<AnalysisDescriptorDTO>(key, get);

  return data;
};

export default apiUrlAnalyze;
