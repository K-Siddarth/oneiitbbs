import SocietyPage from '../components/SocietyPage';

export default function Cinewave() {
  return (
    <SocietyPage
      societyName="Cinewave"
      logoSource={require('@/assets/images/cinewave_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Good cinema is what results from an artistic combination of all the performing arts, brought together by the right technical expertise. Cinewave, the movie-making society of IIT Bhubaneswar, provides students with an eye for filmmaking an opportunity to enhance their cinematic talent and present their stories to the world through short-films, documentaries and advertisements. The most acclaimed society of the institute, Cinewave has participated in various national level competitions and inter-collegiate events, winning laurels for the institute and setting a benchmark in terms of filmmaking."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
