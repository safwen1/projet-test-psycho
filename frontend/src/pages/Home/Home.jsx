import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TestCard from '../../components/TestCard/TestCard';
import { TestIcons } from '../../components/icons/TestIcons';
import { GcbsIcon, AmbiIcon, RiasecIcon } from '../../components/icons/TestIcons';

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
    id: 'gcbs',
    title: 'Test GCBS',
    description: 'Évaluez votre tendance à adhérer à différentes théories explicatives à travers 40 questions soigneusement sélectionnées. Le GCBS (Generic Conspiracist Beliefs Scale) est un outil scientifique validé qui mesure les différentes dimensions de la pensée critique et analytique. Durée : 10-15 minutes.',
    icon: GcbsIcon,
    path: '/gcbs',
    duration: '10-15 minutes',
    questionCount: 40,
    accentColor: '#2196f3',
    category: 'cognitive'
  },
  {
    id: 'ambi',
    title: 'Test Ambi',
    description: 'Explorez votre rapport à l\'ambiguïté à travers 181 questions variées. Ce test évalue votre capacité à gérer les situations incertaines et votre flexibilité cognitive face à différents scénarios. Une évaluation complète de votre tolérance à l\'ambiguïté dans divers contextes. Durée : 10-15 minutes.',
    icon: AmbiIcon,
    path: '/ambi',
    duration: '10-15 minutes',
    questionCount: 181,
    accentColor: '#4caf50',
    category: 'personality'
  },
  {
    id: 'riasec',
    title: 'Test RIASEC',
    description: 'Découvrez vos intérêts professionnels à travers 360 questions réparties en 4 thèmes. Ce test vous aide à identifier vos domaines de prédilection selon la méthode RIASEC (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel). Durée : 45-50 minutes.',
    icon: RiasecIcon,
    path: '/riasec',
    duration: '45-50 minutes',
    questionCount: 360,
    accentColor: '#9c27b0',
    category: 'personality'
  }
];

const categories = [
  { id: 'all', label: 'Tous les tests', icon: null, color: '#666' },
  { id: 'personality', label: 'Personnalité', icon: TestIcons.personality, color: '#4298B4' },
  { id: 'emotional', label: 'Émotionnel', icon: TestIcons.emotional, color: '#33A474' },
  { id: 'cognitive', label: 'Cognitif', icon: TestIcons.cognitive, color: '#2196f3' }
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
            onStart={() => handleStartTest(test.path)}
          />
        ))}
      </TestsGrid>
    </PageContainer>
  );
};

export default Home;
