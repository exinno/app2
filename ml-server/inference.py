from transformers import AutoTokenizer, GPTJForCausalLM, AutoModelForCausalLM, StoppingCriteria, StoppingCriteriaList
import torch, gc, sys

if len(sys.argv) != 2:
    print("The model name agument to load is required.")
    sys.exit()

model_name = sys.argv[1]

class CharStoppingCriteria(StoppingCriteria):
    def __init__(self, keywords_ids:list):
        self.keywords = keywords_ids

    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        if input_ids[0][-1].item() in self.keywords:
            return True
        return False

if model_name == 'gpt-j':
    model = GPTJForCausalLM.from_pretrained("EleutherAI/gpt-j-6B", revision='float16', torch_dtype=torch.half, low_cpu_mem_usage=True).cuda()
    tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-j-6B")
if model_name == 'kogpt':
    tokenizer = AutoTokenizer.from_pretrained(
    'kakaobrain/kogpt', revision='KoGPT6B-ryan1.5b-float16',  # or float32 version: revision=KoGPT6B-ryan1.5b
    #bos_token='[BOS]', eos_token='[EOS]', unk_token='[UNK]', pad_token='[PAD]', mask_token='[MASK]'
    )
    model = AutoModelForCausalLM.from_pretrained(
    'kakaobrain/kogpt', revision='KoGPT6B-ryan1.5b-float16',  # or float32 version: revision=KoGPT6B-ryan1.5b
    #pad_token_id=tokenizer.eos_token_id,
    torch_dtype='auto', low_cpu_mem_usage=True
    ).to(device='cuda', non_blocking=True)

def run_inference(params):
    gc.collect()
    torch.cuda.empty_cache()
    
    params = dict(params)

    if 'stop_newline' in params and params['stop_newline'] == True:
        del params['stop_newline']
        stop_chars = ['\n'] #, 'Q', '.', '!', '~'
        stop_ids = [tokenizer.encode(w)[0] for w in stop_chars]
        params['stopping_criteria'] = StoppingCriteriaList([CharStoppingCriteria(stop_ids)])

    for k, v in params.items():
        if k in ['prompt', 'stopping_criteria']:
            params[k] = v
        elif k in ['temperature', 'top_p', 'typical_p', 'repetition_penalty', 'length_penalty', 'max_time', 'diversity_penalty']:
            params[k] = float(v)
        elif k in ['do_sample', 'early_stopping', 'output_attentions', 'output_hidden_states', 'output_scores', 'return_dict_in_generate', 'remove_invalid_values', 'synced_gpus']:
            params[k] = v == True or v == 'true'
        else:
            params[k] = int(v)

    input_ids = tokenizer(params['prompt'],
                        return_tensors="pt").input_ids.cuda()

    params.setdefault('do_sample', True)
    # params.setdefault('top_k', 40)
    # params.setdefault('top_p', 0.4)
    # params.setdefault('temperature', 0.8)
    # params.setdefault('repetition_penalty', 2.0)

    gen_tokens = model.generate(input_ids, **params)
    gen_text = tokenizer.decode(gen_tokens[0])
    gen_text = gen_text.removesuffix('[EOS]')

    return gen_text
