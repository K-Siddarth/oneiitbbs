import SocietyPage from '../components/SocietyPage';

export default function RISCScreen() {
  return (
    <SocietyPage
      societyName="RISC"
      logoSource={require('@/assets/images/risc_logo.jpeg')}
      secretary={{
        name: 'Karan Gupta',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Neha Agarwal', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Rahul Sharma', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Pooja Singh', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="RISC (Research and Innovation in Science Club) is a multidisciplinary society focused on scientific research and innovation. We conduct research projects, organize science exhibitions, and collaborate on interdisciplinary studies."
    />
  );
}