import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TestCard from '../../components/TestCard/TestCard';
import { TestIcons } from '../../components/icons/TestIcons';
import { RiasecIcon } from '../../components/icons/TestIcons';

const PageContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%);
  padding: 2rem 1rem;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$isActive ? props.$accentColor : '#e0e0e0'};
  background-color: ${props => props.$isActive ? `${props.$accentColor}10` : 'transparent'};
  color: ${props => props.$isActive ? props.$accentColor : '#666'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  &:hover {
    border-color: ${props => props.$accentColor};
    background-color: ${props => `${props.$accentColor}10`};
    color: ${props => props.$accentColor};
  }
`;

const tests = [
  {
    id: 'riasec',
    title: 'Test Intérêts professionnels',
    description: 'Découvrez vos intérêts professionnels à travers 300 questions réparties en 4 thèmes. Ce test vous aide à identifier vos domaines de prédilection selon la méthode RIASEC (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel). Durée : 45-50 minutes.',
    icon: RiasecIcon,
    path: '/riasec',
    duration: '45-50 minutes',
    questionCount: 24,
    accentColor: '#9c27b0',
    category: 'personality'
  },
  {
    id: 'bigfive',
    title: 'Test Big Five',
    description: 'Découvrez votre profil de personnalité à travers les cinq dimensions fondamentales : Extraversion, Névrosisme, Agréabilité, Conscience et Ouverture. Ce test de 10-15 minutes vous permettra de mieux comprendre vos traits de personnalité dominants.',
    icon: TestIcons.bigFive,
    path: '/bigfive',
    duration: '10-15 minutes',
    questionCount: 50,
    accentColor: '#ff9800',
    category: 'personality'
  },
  {
    id: 'motivation',
    title: 'Test de Motivation',
    description: 'Explorez vos sources de motivation profondes et découvrez ce qui vous pousse réellement à agir. Ce test analysera vos motivations intrinsèques et extrinsèques pour vous aider à mieux comprendre vos moteurs personnels.',
    icon: TestIcons.emotional,
    path: null,
    duration: '15-20 minutes',
    questionCount: 60,
    accentColor: '#33A474',
    category: 'emotional',
    comingSoon: true
  }
];

const categories = [
  { id: 'all', label: 'Tous les tests', icon: null, color: '#666' },
  { id: 'personality', label: 'Personnalité', icon: TestIcons.personality, color: '#4298B4' },
  { id: 'emotional', label: 'Émotionnel', icon: TestIcons.emotional, color: '#33A474' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleStartTest = (testPath) => {
    navigate(testPath);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <Header>
        <Title>Bibliothèque de Tests Psychométriques</Title>
        <Subtitle>
          Explorez notre collection de tests psychométriques validés scientifiquement 
          pour mieux vous comprendre et développer votre potentiel.
        </Subtitle>
      </Header>

      <SearchContainer>
        <SearchBar
          type="text"
          placeholder="Rechercher un test..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CategoriesContainer>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              $isActive={selectedCategory === category.id}
              $accentColor={category.color}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon && <category.icon size={20} color={selectedCategory === category.id ? category.color : '#666'} />}
              {category.label}
            </CategoryButton>
          ))}
        </CategoriesContainer>
      </SearchContainer>

      <TestsGrid>
        {filteredTests.map(test => (
          <TestCard
            key={test.id}
            title={test.title}
            description={test.description}
            duration={test.duration}
            questionCount={test.questionCount}
            icon={test.icon}
            accentColor={test.accentColor}
            onStart={() => test.comingSoon ? null : handleStartTest(test.path)}
            comingSoon={test.comingSoon}
          />
        ))}
      </TestsGrid>
    </PageContainer>
  );
};

export default Home;
