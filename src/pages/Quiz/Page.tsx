import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../components/ui/tabs';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import DefaultLayout from '@/layout/DefaultLayout';
import { useToast } from '@/components/ui/use-toast';
import { useQuizStore } from '@/store/useQuizStore';
import { useParams } from 'react-router-dom';

type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | MultipleAnswersQuestion
  | MatchingQuestion;

interface MultipleChoiceQuestion {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

interface TrueFalseQuestion {
  type: 'true_false';
  question: string;
  correctAnswer: 'true' | 'false';
}

interface ShortAnswerQuestion {
  type: 'short_answer';
  question: string;
  correctAnswer: string;
}

interface MultipleAnswersQuestion {
  type: 'multiple_answers';
  question: string;
  options: string[];
  correctAnswer: string[];
}

interface MatchingQuestion {
  type: 'matching';
  question: string;
  options: Record<string, string>;
  correctAnswer: Record<string, string>;
}

const questionTypes = [
  { label: 'True/False', value: 'true_false' },
  { label: 'Multiple Choice', value: 'multiple_choice' },
  { label: 'Short Answer', value: 'short_answer' },
  { label: 'Multiple Answers', value: 'multiple_answers' },
  { label: 'Matching', value: 'matching' },
];

const QuizCreate = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { toast } = useToast();
  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      title: '',
      questions: [{ type: 'true_false', content: {} }],
    },
  });

  const addQuiz = useQuizStore((state) => state.addQuiz);

  // No need to fetch quizzes since they're already loaded in the store
  // useEffect removed to prevent infinite loops

  const [questions, setQuestions] = useState([
    { type: 'true_false', content: {} },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'true_false', content: {} }]);
  };

  const updateQuestionType = (index: number, type: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    setQuestions(updatedQuestions);
  };

  const onSubmit = (data: any) => {
    const updatedQuestions = questions.map((question, index) => ({
      type: question.type,
      ...data.questions[index].content,
    }));

    try {
      // Process quiz creation
      const quizQuestions = updatedQuestions.map((q, questionIndex) => {
        // Prepare options array for multiple choice questions
        const options = [];
        if (q.type === 'multiple_choice' && q.options) {
          for (let i = 0; i < q.options.length; i++) {
            if (q.options[i]) {
              options.push({
                id: i + 1,
                text: q.options[i],
                correct: q.correctAnswer === `${i + 1}`,
              });
            }
          }
        }

        return {
          id: questionIndex + 1, // Temporary ID
          quiz_id: 0, // Will be set by the store
          question: q.question,
          type: q.type,
          options: options,
        };
      });

      // Add quiz using Zustand store
      addQuiz({
        title: data.title,
        description: 'Quiz created with the quiz editor',
        module_id: parseInt(moduleId || '0'),
        questions: quizQuestions,
      });

      toast({
        title: 'Quiz created successfully',
      });

      // Reset form or redirect
      window.location.href = `/admin/modules/${moduleId}`;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Quiz creation failed',
        variant: 'destructive',
      });
    }
  };

  const renderQuestionForm = (question: any, index: number) => {
    switch (question.type) {
      case 'true_false':
        return <TrueFalseQuestion control={control} questionIndex={index} />;
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion control={control} questionIndex={index} />
        );
      case 'short_answer':
        return <ShortAnswerQuestion control={control} questionIndex={index} />;
      case 'multiple_answers':
        return (
          <MultipleAnswerQuestion control={control} questionIndex={index} />
        );
      case 'matching':
        return (
          <MatchingAnswerQuestion control={control} questionIndex={index} />
        );
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 md:gap-10">
            {/* Quiz Title */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Title
              </label>
              <Input
                {...register('title')}
                placeholder="Enter quiz title"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* ShadCN Tabs to organize questions */}
            <Tabs defaultValue="question-0" className="flex flex-col gap-4">
              <div className="overflow-x-auto">
                <TabsList className="flex flex-wrap items-center min-h-12 sm:min-h-16 lg:min-h-20 overflow-x-auto p-2 gap-2 w-full">
                  {questions.map((_, index) => (
                    <TabsTrigger
                      className="flex-shrink-0 dark:data-[state=active]:bg-meta-3 data-[state=active]:bg-meta-3 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:rounded-lg dark:bg-meta-4 bg-meta-9 dark:text-white text-meta-4 min-w-[2rem] h-8 sm:h-10 text-sm sm:text-base"
                      key={index}
                      value={`question-${index}`}
                    >
                      {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Each tab content for the question */}
              {questions.map((question, index) => (
                <TabsContent
                  className="mt-4"
                  key={index}
                  value={`question-${index}`}
                >
                  <div className="border border-stroke dark:border-form-strokedark rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">
                      Question {index + 1}
                    </h3>

                    {/* Dropdown to select question type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          updateQuestionType(index, e.target.value)
                        }
                        className="w-full sm:max-w-xs py-2 px-3 border rounded border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary focus:border-primary focus:outline-none"
                      >
                        {questionTypes.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Render form based on the question type */}
                    <div className="w-full">
                      {renderQuestionForm(question, index)}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Submit Quiz */}
            <div className="w-full flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-white dark:bg-boxdark p-4 rounded-lg shadow-lg">
              <button
                type="button"
                onClick={addQuestion}
                className="order-2 sm:order-1 bg-meta-3 flex-1 text-white px-4 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
              >
                Add Question
              </button>
              <button
                type="submit"
                className="order-1 sm:order-2 bg-meta-5 flex-1 text-white px-4 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

interface TrueFalseQuestionProps {
  control: any;
  questionIndex: number;
}

const TrueFalseQuestion = ({
  control,
  questionIndex,
}: TrueFalseQuestionProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Question
      </label>
      <Textarea
        {...control.register(`questions[${questionIndex}].content.question`)}
        placeholder="Enter the question here"
        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none min-h-[100px]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Set correct answer
      </label>
      <Controller
        control={control}
        name={`questions[${questionIndex}].content.correctAnswer`}
        defaultValue="true"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="true" id={`r1_${questionIndex}`} />
              <Label
                htmlFor={`r1_${questionIndex}`}
                className="text-base cursor-pointer"
              >
                True
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="false" id={`r2_${questionIndex}`} />
              <Label
                htmlFor={`r2_${questionIndex}`}
                className="text-base cursor-pointer"
              >
                False
              </Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  </div>
);

interface MultipleChoiceQuestionProps {
  control: any;
  questionIndex: number;
}

const MultipleChoiceQuestion = ({
  control,
  questionIndex,
}: MultipleChoiceQuestionProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Question
      </label>
      <Textarea
        {...control.register(`questions[${questionIndex}].content.question`)}
        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none min-h-[100px]"
        placeholder="Enter the question here"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Options & Correct Answer
      </label>
      <Controller
        control={control}
        name={`questions[${questionIndex}].content.correctAnswer`}
        defaultValue="1"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            className="space-y-3"
          >
            {[0, 1, 2, 3].map((optionIndex) => (
              <div
                key={optionIndex}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-2 order-2 sm:order-1">
                  <RadioGroupItem
                    value={`${optionIndex + 1}`}
                    id={`mcq_${optionIndex}_${questionIndex}`}
                  />
                  <Label
                    htmlFor={`mcq_${optionIndex}_${questionIndex}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    Correct
                  </Label>
                </div>
                <Input
                  {...control.register(
                    `questions[${questionIndex}].content.options[${optionIndex}]`,
                  )}
                  className="order-1 sm:order-2 flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                />
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  </div>
);

interface ShortAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const ShortAnswerQuestion = ({
  control,
  questionIndex,
}: ShortAnswerQuestionProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Question
      </label>
      <Textarea
        {...control.register(`questions[${questionIndex}].content.question`)}
        placeholder="Enter the question here"
        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none min-h-[100px]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Correct Answer
      </label>
      <Input
        {...control.register(
          `questions[${questionIndex}].content.correctAnswer`,
        )}
        type="text"
        placeholder="Enter the correct answer"
        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  </div>
);

interface MultipleAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const MultipleAnswerQuestion = ({
  control,
  questionIndex,
}: MultipleAnswerQuestionProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Question
      </label>
      <Textarea
        {...control.register(`questions[${questionIndex}].content.question`)}
        placeholder="Enter the question here"
        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none min-h-[100px]"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Options (Select multiple correct answers)
      </label>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((optionIndex) => (
          <div
            key={optionIndex}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <Input
              {...control.register(
                `questions[${questionIndex}].content.options[${optionIndex}]`,
              )}
              className="order-1 flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              type="text"
              placeholder={`Option ${optionIndex + 1}`}
            />
            <div className="flex items-center space-x-2 order-2">
              <Controller
                control={control}
                name={`questions[${questionIndex}].content.correctAnswer`}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    value={`option_${optionIndex}`}
                    id={`option_${optionIndex}_${questionIndex}`}
                  />
                )}
              />
              <Label
                htmlFor={`option_${optionIndex}_${questionIndex}`}
                className="text-sm font-medium cursor-pointer"
              >
                Correct
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface MatchingAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const MatchingAnswerQuestion = ({
  control,
  questionIndex,
}: MatchingAnswerQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
    />
    <div>Set correct matches</div>
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Input
            {...control.register(
              `questions[${questionIndex}].content.options.option_${optionIndex}`,
            )}
            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
            type="text"
            placeholder={`Option ${optionIndex + 1}`}
          />
          <Input
            {...control.register(
              `questions[${questionIndex}].content.correctAnswer.match_${optionIndex}`,
            )}
            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
            type="text"
            placeholder={`Match ${optionIndex + 1}`}
          />
        </div>
      ))}
    </div>
  </div>
);

export default QuizCreate;
