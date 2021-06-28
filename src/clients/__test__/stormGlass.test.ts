import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    it('should return the normalized forecast from the StormGlass service', async () => {
        const lat = -35.792723;
        const lng = 151.289284;

        mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassNormalized3HoursFixture)
    });

    it('should exclude incomplete data points', async () => {
        const lat = -35.792723;
        const lng = 151.289284;

        const incompleteResponse = {
            hours: [{
                windDirection: {
                    noaa: 600,
                },
                time: '2021-06-23T00:00:00+00:00'
            }]
        }

        mockedAxios.get.mockResolvedValue({ data: incompleteResponse });
        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng)
        expect(response).toEqual([])
    });

    it('should get a generic error from StormGlass service when the request fails before reaching the service', async () => {
        const lat = -35.792723;
        const lng = 151.289284;

        mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockedAxios);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected Error when try to communicate to StormGlass: Network Error');
    });

    it('should get a StormGlassResponseError when the StormaGlassService responds with error', async () => {
        const lat = -35.792723;
        const lng = 151.289284;

        mockedAxios.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate Limit Reached'] }
            },
        });

        const stormGlass = new StormGlass(mockedAxios)

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error returned by the StormGlassService: Error: {"errors":["Rate Limit Reached"]}');
    });
});